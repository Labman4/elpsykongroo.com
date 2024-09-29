import { user, notification, topic, message  } from '~/assets/ts/interface';

const notifications:notification[] = [];
const users:user[] = []
const topics:topic[] = []
const messages:message[] = [];

const data = reactive({notifications, users, topics, messages});

let inituserFormData  = () => ({
    email: "",
    nickName: "",
    username: "",
    password: "",
    locked: false,
  })
  
let userFormData = reactive(inituserFormData());
const claims = ref({});
let dynamicClaimForm = reactive(claims);

let inituserInfoTable  = () => ({
  sub: "",
  name: "",
  given_name: "",
  family_name: "",
  middle_name: "",
  nickname: "",
  preferred_username: "",
  profile: "",
  picture: "",
  website: "",
  email: "",
  email_verified: "",
  gender: "",
  birthdate: "",
  zoneinfo: "",
  locale: "",
  phone_number: "",
  phone_number_verified: "",
  address: "",
  updated_at: "",
  claims: "",
  username: ""
})

let userInfoTableData = reactive(inituserInfoTable());
export { dynamicClaimForm, userFormData, userInfoTableData, inituserInfoTable, data }