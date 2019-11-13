import axios from "axios"
import { isEmpty } from "lodash"
import { saveAs } from "file-saver"
import credentials from "./../credentials"
import getToken from "./token"

function api() {
  const {
    classroomURL,
    pdfURL,
    validateTokenURL,
    baseURL,
    userURL,
    accountURL
  } = credentials.prod

  const isValidToken = async () => {
    try {
      const token = await getToken()
      axios.defaults.headers.Authorization = "bearer " + token
      axios.defaults.baseURL = baseURL
      const response = await axios.post(validateTokenURL)
      return response.data.isValid
    } catch (error) {}
  }

  const getClassroom = async () => {
    try {
      const response = await axios.get(classroomURL)
      return response.data.result
    } catch (error) {
      if (error.response.status) {
        const { status, statusText } = error.response
        const errorObject = { status, statusText }
        throw errorObject
      }
      throw Error(error)
    }
  }

  const removeClassroom = async classroom => {
    try {
      await axios.delete(`${classroomURL}/${classroom.id}`)
    } catch (error) {
      if (error.response.status) {
        const { status } = error.response
        throw status
      }
      return new Error(error)
    }
  }

  const saveClassroom = async classroom => {
    const method = classroom.id ? "put" : "post"
    const finalUrl = classroom.id
      ? `${classroomURL}/${classroom.id}`
      : classroomURL
    try {
      const response = await axios[method](finalUrl, classroom)
      return classroom.id ? classroom : response.data.classroom[0]
    } catch (error) {
      if (error.response.status) {
        const { status } = error.response
        throw status
      }
      return new Error(error)
    }
  }

  const fetchAndGetList = async list => {
    try {
      await axios.post(pdfURL, { data: list })
      const response = await axios.get(pdfURL, {
        responseType: "blob"
      })
      const listBlob = new Blob([response.data], { type: "application/pdf" })
      saveAs(listBlob, "list.pdf")
    } catch (error) {
      if (error.response.status) {
        const { status } = error.response
        throw status
      }
      return new Error(error)
    }
  }

  const getUser = async () => {
    try {
      const response = await axios.get(userURL)
      return response.data.result
    } catch (error) {
      if (error.response.status) {
        const { status } = error.response
        throw status
      }
      return new Error(error)
    }
  }

  const saveUser = async user => {
    const method = user.id ? "put" : "post"
    const finalUrl = user.id ? `${userURL}/${user.id}` : userURL
    try {
      const response = await axios[method](finalUrl, user)
      if (!user.id) {
        user.id = response.data.id
      }
      return user
    } catch (error) {
      if (error.response.status) {
        const { status } = error.response
        throw status
      }
      return new Error(error)
    }
  }

  const removeUser = async user => {
    try {
      await axios.delete(`${userURL}/${user.id}`)
    } catch (error) {
      if (error.response.status) {
        const { status } = error.response
        throw status
      }
      return new Error(error)
    }
  }

  // Terminar checagem de senha

  const checkPassword = async account => {
    try {
      const response = await axios.post(`${accountURL}/${account.id}`, account)
      if (response.data) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
    }
  }

  const editUser = async user => {
    const finalURL = `${accountURL}/${user.id}`
    const { old_password_user, new_password_user } = user
    try {
      if (
        (!old_password_user && new_password_user) ||
        (old_password_user && !new_password_user)
      ) {
        console.log("if")
        throw new Error("É necessário preencher ambas as senhas ou nenhuma")
      } else if (!isEmpty(old_password_user) && !isEmpty(new_password_user)) {
        if (!checkPassword(user)) throw new Error("Senha incorreta")
      } else if (isEmpty(old_password_user) && isEmpty(new_password_user)) {
        delete user.old_password_user
        delete user.new_password_user
      }
      await axios.put(finalURL, user)
    } catch (error) {
      console.log(error)
      if (error.message) {
        const errorTitle = { title: error.message }
        throw errorTitle
      }
      if (error.response.status) {
        const { status } = error.response
        throw status
      }
      return error
    }
  }

  const classroom = {
    save: saveClassroom,
    remove: removeClassroom,
    get: getClassroom,
    fetchAndGetList
  }

  const user = {
    save: saveUser,
    remove: removeUser,
    get: getUser
  }

  const account = {
    save: editUser,
    checkPassword
  }

  return {
    classroom,
    user,
    account,
    isValidToken
  }
}

export default api
