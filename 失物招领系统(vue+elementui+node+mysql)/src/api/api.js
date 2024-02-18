import axios from 'axios'; // 引入axios
const baseURL = 'http://localhost:5000'; // 本地后台服务器地址

function axPost(url, params) {
  return axios.post(baseURL + url, params).then(res => res);
}

export const Login = params => {
  // 登录接口
  return axPost('/login', params);
};
export const Register = params => {
  // 注册接口
  return axPost('/register', params);
};
export const ChangePassword = params => {
  // 修改密码接口
  return axPost('/changePassword', params);
};
export const LostTings = params => {
  // 失物信息接口
  return axPost('/lostTings', params);
};
export const FoundThings = params => {
  // 招领信息接口
  return axPost('/foundThings', params);
};
export const LostNotice = params => {
  // 发布失物信息接口
  return axPost('/lostNotice', params);
};
export const FoundNotice = params => {
  // 发布招领信息接口
  return axPost('/foundNotice', params);
};
export const GetAllUsers = params => {
  // 获取所有用户接口
  return axPost('/getAllUsers', params);
};
export const DeleteUser = params => {
  // 删除指定用户接口
  return axPost('/deleteUser', params);
};
export const EditUserInfo = params => {
  // 编辑指定用户信息接口
  return axPost('/editUserInfo', params);
};
export const GetAllLost = params => {
  // 获取所有失物信息接口
  return axPost('/getAllLost', params);
};
export const DeleteLostInfo = params => {
  // 删除指定失物信息接口
  return axPost('/deleteLostInfo', params);
};
export const EditLostInfo = params => {
  // 编辑指定失物信息接口
  return axPost('/editLostInfo', params);
};
export const GetAllFound = params => {
  // 获取所有招领信息接口
  return axPost('/getAllFound', params);
};
export const DeleteFoundInfo = params => {
  // 删除指定招领信息接口
  return axPost('/deleteFoundInfo', params);
};
export const EditFoundInfo = params => {
  // 编辑指定招领信息接口
  return axPost('/editFoundInfo', params);
};
export const AddLiveWord = params => {
  // 发布留言接口 接口地址 /addLiveWord 将参数 params 作为 POST 请求的请求体发送给接口地址 /addLiveWord
  return axPost('/addLiveWord', params);
};
export const GetAllLiveWord = params => {
  // 获取所有留言接口
  return axPost('/getAllLiveWord', params);
};
export const DeleteLiveWordData = params => {
  // 删除指定留言接口
  return axPost('/deleteLiveWordData', params);
};
export const EditLiveWordData = params => {
  // 编辑指定留言接口
  return axPost('/editLiveWordData', params);
};
export const SearchId = params => {
  // 模糊查询接口
  return axPost('/searchId', params);
};
export const GetAllTips = params => {
  // 获取所有小标语接口
  return axPost('/getAllTips', params);
};
export const AddTips = params => {
  // 新增小标语接口
  return axPost('/addTips', params);
};
export const DeleteTips = params => {
  // 删除小标语
  return axPost('/deleteTips', params);
};
export const EditTips = params => {
  // 编辑小标语接口
  return axPost('/editTips', params);
};
//  GetAllManger, EditManger, DeleteManger, AddManger
export const GetAllManger = params => {
  // 获取所有值班列表接口
  return axPost('/getAllManger', params);
};
export const AddManger = params => {
  // 新增值班列表接口
  return axPost('/addManger', params);
};
export const DeleteManger = params => {
  // 删除值班列表
  return axPost('/deleteManger', params);
};
export const EditManger = params => {
  // 编辑值班列表接口
  return axPost('/editManger', params);
};
export const GetFoundLength = params => {
  // 获取招领数据长度
  return axPost('/getFoundLength', params);
};
export const GetUserLost = params => {
  // 获取指定用户的失物信息
  return axPost('/getUserLost', params);
};
export const GetUserFound = params => {
  // 获取指定用户的招领信息
  return axPost('/getUserFound', params);
};
export const ChangeStatus = params => {
  // 修改失物招领物品状态
  return axPost('/changeStatus', params);
};
