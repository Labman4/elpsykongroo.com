<template>
    <div class="hidden-md-and-down">
        <div id="top-blank"></div>
        <div id='nixietube-template' style='display:none;'>
            <div id='nixie-tube-[order]' class='nixie-container'>
                <div class='nixie-background'></div>
                <SvgIcon class='nixie-number nixie-number-0' name="clock-0"></SvgIcon>
                <SvgIcon class='nixie-number nixie-number-1' name="clock-1"></SvgIcon>
                <SvgIcon class='nixie-number nixie-number-2' name="clock-2"></SvgIcon>
                <SvgIcon class='nixie-number nixie-number-3' name="clock-3"></SvgIcon>
                <SvgIcon class='nixie-number nixie-number-4' name="clock-4"></SvgIcon>
                <SvgIcon class='nixie-number nixie-number-5' name="clock-5"></SvgIcon>
                <SvgIcon class='nixie-number nixie-number-6' name="clock-6"></SvgIcon>
                <SvgIcon class='nixie-number nixie-number-7' name="clock-7"></SvgIcon>
                <SvgIcon class='nixie-number nixie-number-8' name="clock-8"></SvgIcon>
                <SvgIcon class='nixie-number nixie-number-9' name="clock-9"></SvgIcon>
            </div>
        </div>
        <div id='clock-surface'></div>
    </div>
</template>
<style>
  #top-blank {
    top: 5.8%;
    position: fixed;
    left: 0px;
    background-color: #000000;
    height: 22.6%;
    width: 100%;
    border: 0px;
  }

  #clock-surface {
      position: fixed;
      top: 200px;
      left: 0%;
      width: 100%;
      height: 80%;
      text-align: center;
      background-color: #000000;
  
  }
  
  .nixie-container {
      display: inline-block;
      width: 100px;
      height: 200px;
      margin: 0 20px;
  }
  
  .nixie-background {
      position: absolute;
      width: 100px;
      height: 200px;
  }
  
  .nixie-background.active {
      background-color: rgba(255, 189, 23, 0.1);
      filter: blur(25px);
      -webkit-filter: blur(25px);
      -ms-filter: blur(25px);
      -moz-filter: blur(25px);
  }
  
  .nixie-container .nixie-number {
      display: block;
      position: absolute;
      width: 100px;
  }
  
  .nixie-number .nixie-number-part {
      fill: none;
      stroke: rgba(0, 0, 0, 0.4);
      stroke-width: 10;
      stroke-linecap: round;
      stroke-miterlimit: 10;
  }
  
  .nixie-number.active .nixie-number-part {
      stroke: #F58549;
  }
  
  .white-space {
      display: inline-block;
      width: 40px;
  }
</style>
<script lang="ts" setup>
    import $ from "jquery";
    function update() {
        var date = new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        var num0 = Math.floor(hour / 10);
        var num1 = hour - 10 * num0;
        var num2 = Math.floor(minute / 10);
        var num3 = minute - 10 * num2;
        var num4 = Math.floor(second / 10);
        var num5 = second - 10 * num4;
        var num:number[] = [];
        num.push(num0);
        num.push(num1);
        num.push(num2);
        num.push(num3);
        num.push(num4);
        num.push(num5);

        for (var i = 0; i < 6; i++) {
            var temp = num[i];
            var grandSelector = "#nixie-tube-" + i;
            var allNumbers = grandSelector + " .nixie-number";
            var childSelector = grandSelector + " .nixie-number-" + temp;
            var background = grandSelector + " .nixie-background";

            $(allNumbers).each(function () {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                }
            });

            if ($(background).hasClass('active')) {
                $(background).removeClass('active');
            }

            $(childSelector).addClass('active');
            $(background).addClass('active');
        }
    } 

    $(function () {
        initializeNixieTube(6, 2);
        update();
        setInterval(() => {update()}, 1000);
    });

    function initializeNixieTube(number:number, whiteSpaceSpan:number) {
        var template = $('#nixietube-template').html();
        var targetHTML = "";
        var whiteSpace = "<div class='white-space'></div>";
        var CurrentTubeNumber = 0;
        while (CurrentTubeNumber < number) {
            if (whiteSpaceSpan > 0) {
                if (CurrentTubeNumber % whiteSpaceSpan == 0 && CurrentTubeNumber > 0)
                    $('#clock-surface').append(whiteSpace);
            }
            targetHTML = template.replace("[order]", CurrentTubeNumber?.toLocaleString());
            $('#clock-surface').append(targetHTML);
            CurrentTubeNumber++;
        }
    };

</script>

