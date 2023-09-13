import { user, notification, topic  } from '~/assets/ts/interface';

const notification:notification[] = [];
const users:user[] = []
const topic:topic[] = []

const data = reactive({notification, users, topic});

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
export { dynamicClaimForm, userFormData, userInfoTableData, inituserInfoTable,data }