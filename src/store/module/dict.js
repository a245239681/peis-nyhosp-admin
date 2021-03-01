import {
  roomDictList, examTypeList, specimanList, clinicalList, countryList,
  nationList, occupationList, identityList, staffTypeList, dictHisDeptList, jobTitleList, staffDictList,
  ICD10List,
  unitTypeList,
  priorityList,
  chargeTypeList,
  comboTypeList,
  examSubTypeList,
  testTubeList,
  hisImplementDeptList, // his执行科室字典
  examDoctorList, // 检查医生列表
  expenseTypeList, // 费用类别
  personSourceList, // 人员来源列表
  checkDoctorMaintenanceList, // 医生列表
  orgList, // 机构字典列表
  medicalInsuranceList, // 医保字典列表
  funcRoomList, // 功能科室字典列表
  mainConclusionList // 总检结论字典列表
} from '@/api/dict'
import { categoryList } from '@/api/dict_category'
import { diseaseTypeAllList } from '@/api/busdict_diseaseType.js'
// 分科小结、分科病史、分科建议
import { medicalHistory, conclusion, suggest } from '@/api/record_result'

export default {
  state: {
    roomDict: [],
    examType: [],
    specimanDict: [],
    clinicalType: [],
    categoryDict: [],
    countryDict: [],
    nationDict: [],
    occupationDict: [],
    identityDict: [],
    diseaseType: [],
    staffTypeDict: [],
    hisDeptDict: [],
    jobTitleDict: [],
    staffDict: [],
    ICD10Dict: [],
    unitTypeDict: [],
    priorityDict: [],
    chargeTypeDict: [],
    comboTypeDict: [],
    examSubTypeDict: [],
    testTubeDict: [],
    medicalHistoryDict: [],
    conclusionDict: [],
    suggestDict: [],
    deptPersonList: [],
    hisImplementDict: [],
    examDoctorDict: [],
    expenseTypeDict: [],
    personSourceDict: [],
    checkDoctorDict: [],
    orgDict: [],
    finExamDoctorDict: [], // 总检医生
    mainExamDoctorDict: [], // 主检医生
    medicalInsuranceDict: [],
    funcRoomDict: [],
    mainConclusionDict: []
  },
  getters: {
    getRoomDict: state => state.roomDict, // 获取体检科室字典
    getHisDeptDict: state => state.hisDeptDict, // 获取his科室字典
    getExamType: state => state.examType, // 获取检查类别字典
    getSpeciman: state => state.specimanDict, // 获取标本字典
    getClinicalType: state => state.clinicalType, //  获取临床类型字典
    getCategoryDict: state => state.categoryDict, // 获取体检类型字典
    getCountryDict: state => state.countryDict, // 获取国家字典
    getNationDict: state => state.nationDict, // 获取民族字典
    getOccupationDict: state => state.occupationDict, // 获取职业字典
    getIdentityDict: state => state.identityDict, // 获取身份字典
    getDiseaseType: state => state.diseaseType, // 获取疾病分类字典
    getStaffTypeDict: state => state.staffTypeDict, // 获取工作人员类别字典
    getJobTitleDict: state => state.jobTitleDict, // 获取职称字典
    getStaffDict: state => state.staffDict, // 获取工作人员字典
    getICD10Dict: state => state.ICD10Dict, // 获取ICD10字典
    getUnitTypeDict: state => state.unitTypeDict, // 获取单位类别字典
    getPriorityDict: state => state.priorityDict, // 获取优先级字典
    getChargeTypeDict: state => state.chargeTypeDict, // 获取费别字典
    getComboTypeDict: state => state.comboTypeDict, // 获取组合分类字典
    getExamSubTypeDict: state => state.examSubTypeDict, // 获取检查子类字典
    getTestTubeDict: state => state.testTubeDict, // 获取试管字典
    getMedicalHistoryDict: state => state.medicalHistoryDict, // 获取分科病史
    getConclusionDict: state => state.conclusionDict, // 获取分科小结
    getSuggestDict: state => state.suggestDict, // 获取分科建议
    getFinExamDoctorDict: state => state.finExamDoctorDict, // 获取总检医生
    getMainExamDoctorDict: state => state.mainExamDoctorDict, // 获取主检医生
    getHisImplementDict: state => state.hisImplementDict, // 获取his执行科室
    getExamDoctorDict: state => state.examDoctorDict, // 获取检查医生
    getExpenseTypeDict: state => state.expenseTypeDict, // 获取费用类别字典
    getPersonSourceDict: state => state.personSourceDict, // 获取人员来源字典
    getCheckDoctorDict: state => state.checkDoctorDict, // 获取医生字典
    getOrgDict: state => state.orgDict, // 获取机构字典
    getMedicalInsuranceDict: state => state.medicalInsuranceDict, // 获取医保字典
    getFuncRoomDict: state => state.funcRoomDict, // 获取功能科室字典
    getMainConclusionDict: state => state.mainConclusionDict // 获取总检结论字典
  },
  mutations: {
    setRoomDict (state, roomDict) {
      state.roomDict = roomDict
    },
    setHisDeptDict (state, hisDept) {
      state.hisDeptDict = hisDept
    },
    setExamType (state, examType) {
      state.examType = examType
    },
    setSpeciman (state, specimanDict) {
      state.specimanDict = specimanDict
    },
    setClinicalType (state, clinicalType) {
      state.clinicalType = clinicalType
    },
    setCategoryDict (state, categoryDict) {
      state.categoryDict = categoryDict
    },
    setCountryDict (state, countryDict) {
      state.countryDict = countryDict
    },
    setNationDict (state, nationDict) {
      state.nationDict = nationDict
    },
    setOccupationDict (state, occupationDict) {
      state.occupationDict = occupationDict
    },
    setIdentityDict (state, identityDict) {
      state.identityDict = identityDict
    },
    setDiseaseType (state, diseaseType) {
      state.diseaseType = diseaseType
    },
    setStaffTypeDict (state, staffTypeDict) {
      state.staffTypeDict = staffTypeDict
    },
    setJobTitleDict (state, jobTitle) {
      state.jobTitleDict = jobTitle
    },
    setStaffDict (state, staffDict) {
      state.staffDict = staffDict
    },
    setICD10Dict (state, ICD10Dict) {
      state.ICD10Dict = ICD10Dict
    },
    setUnitTypeDict (state, unitTypeDict) {
      state.unitTypeDict = unitTypeDict
    },
    setPriorityDict (state, priorityDict) {
      state.priorityDict = priorityDict
    },
    setChargeTypeDict (state, chargeTypeDict) {
      state.chargeTypeDict = chargeTypeDict
    },
    setComboTypeDict (state, comboTypeDict) {
      state.comboTypeDict = comboTypeDict
    },
    setExamSubTypeDict (state, examSubTypeDict) {
      state.examSubTypeDict = examSubTypeDict
    },
    setTestTubeDict (state, testTubeDict) {
      state.testTubeDict = testTubeDict
    },
    setMedicalHistoryDict (state, medicalHistoryDict) {
      state.medicalHistoryDict = medicalHistoryDict
    },
    setConclusionDict (state, conclusionDict) {
      state.conclusionDict = conclusionDict
    },
    setSuggestDict (state, suggestDict) {
      state.suggestDict = suggestDict
    },
    setHisImplementDict (state, hisImplementDict) {
      state.hisImplementDict = hisImplementDict
    },
    setExamDoctorDict (state, examDoctorDict) {
      state.examDoctorDict = examDoctorDict
    },
    setExpenseTypeDict (state, expenseTypeDict) {
      state.expenseTypeDict = expenseTypeDict
    },
    setPersonSourceDict (state, personSourceDict) {
      state.personSourceDict = personSourceDict
    },
    setCheckDoctorDict (state, checkDoctorDict) {
      state.checkDoctorDict = checkDoctorDict
    },
    setOrgDict (state, orgDict) {
      state.orgDict = orgDict
    },
    setFinExamDoctorDict (state, finExamDoctorDict) {
      state.finExamDoctorDict = finExamDoctorDict
    },
    setMainExamDoctorDict (state, mainExamDoctorDict) {
      state.mainExamDoctorDict = mainExamDoctorDict
    },
    setMedicalInsuranceDict (state, medicalInsuranceDict) {
      state.medicalInsuranceDict = medicalInsuranceDict
    },
    setFuncRoomDict (state, funcRoomDict) {
      state.funcRoomDict = funcRoomDict
    },
    setMainConclusionDict (state, mainConclusionDict) {
      state.mainConclusionDict = mainConclusionDict
    }
  },
  actions: {
    getRoomDict ({ state, commit }, btn = false) {
      // btn 更新字典时需要更新vuex状态传true
      if (state.roomDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        roomDictList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setRoomDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getFuncRoomDict ({ state, commit }, btn = false) {
      // btn 更新字典时需要更新vuex状态传true
      if (state.funcRoomDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        funcRoomList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setFuncRoomDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getHisDeptDict ({ state, commit }, btn = false) {
      if (state.hisDeptDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        dictHisDeptList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setHisDeptDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getExamType ({ state, commit }, btn = false) {
      if (state.examType.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        examTypeList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setExamType', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getSpecimanDict ({ state, commit }, btn = false) {
      if (state.specimanDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        specimanList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setSpeciman', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getClinicalType ({ state, commit }, btn = false) {
      if (state.clinicalType.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        clinicalList({}).then(({ data }) => {
          console.log(data)
          if (data.code == 0) {
            commit('setClinicalType', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCategoryDict ({ state, commit }, btn = false) {
      if (state.categoryDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        categoryList({}).then(({ data }) => {
          if (data.code === 0) {
            // console.log(data);
            commit('setCategoryDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCountryDict ({ state, commit }, btn = false) {
      if (state.countryDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        countryList({}).then(({ data }) => {
          if (data.code == 0) {
            // console.log(data);
            commit('setCountryDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getNationDict ({ state, commit }, btn = false) {
      if (state.nationDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        nationList({}).then(({ data }) => {
          if (data.code == 0) {
            // console.log(data);
            commit('setNationDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getOccupationDict ({ state, commit }, btn = false) {
      if (state.occupationDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        occupationList({}).then(({ data }) => {
          if (data.code == 0) {
            // console.log(data);
            commit('setOccupationDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getIdentityDict ({ state, commit }, btn = false) {
      if (state.identityDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        identityList({}).then(({ data }) => {
          if (data.code == 0) {
            // console.log(data);
            commit('setIdentityDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getDiseaseType ({ state, commit }, btn = false) {
      if (state.diseaseType.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        diseaseTypeAllList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setDiseaseType', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getStaffTypeDict ({ state, commit }, btn = false) {
      if (state.staffTypeDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        staffTypeList({}).then(({ data }) => {
          if (data.code == 0) {
            console.log('工作类别:' + data)
            commit('setStaffTypeDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getJobTitleDict ({ state, commit }, btn = false) {
      if (state.jobTitleDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        jobTitleList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setJobTitleDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getStaffDict ({ state, commit }, btn = false) {
      if (state.staffDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        staffDictList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setStaffDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getICD10Dict ({ state, commit }, btn = false) {
      if (state.ICD10Dict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        ICD10List({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setICD10Dict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getUnitTypeDict ({ state, commit }, btn = false) {
      if (state.unitTypeDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        unitTypeList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setUnitTypeDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getPriorityDict ({ state, commit }, btn = false) {
      if (state.priorityDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        priorityList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setPriorityDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getChargeTypeDict ({ state, commit }, btn = false) {
      if (state.chargeTypeDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        chargeTypeList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setChargeTypeDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getComboTypeDict ({ state, commit }, btn = false) {
      if (state.comboTypeDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        comboTypeList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setComboTypeDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getExamSubTypeDict ({ state, commit }, btn = false) {
      if (state.examSubTypeDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        examSubTypeList({}).then(({ data }) => {
          console.log(data)
          if (data.code == 0) {
            commit('setExamSubTypeDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getTestTubeDict ({ state, commit }, btn = false) {
      if (state.testTubeDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        testTubeList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setTestTubeDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getConclusionDict ({ state, commit }, { params, btn = false }) {
      if (state.conclusionDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        conclusion(params).then(({ data }) => {
          if (data.code == 0) {
            commit('setConclusionDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getMedicalHistoryDict ({ state, commit }, { params, btn = false }) {
      if (state.medicalHistoryDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        medicalHistory(params).then(({ data }) => {
          if (data.code == 0) {
            commit('setMedicalHistoryDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getSuggestDict ({ state, commit }, { params, btn = false }) {
      if (state.suggestDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        suggest(params).then(({ data }) => {
          // console.log(data)
          if (data.code == 0) {
            commit('setSuggestDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getExamDoctorDict ({ state, commit }, { params, btn = false }) {
      console.log(btn)
      if (state.examDoctorDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        // console.log(params)
        examDoctorList(params).then(({ data }) => {
          // console.log(data)
          if (data.code == 0) {
            if (params.deptName == '总检医生') {
              commit('setFinExamDoctorDict', data.data)
            } else if (params.deptName == '主检医生') {
              console.log('主检医生列表', data.data)
              commit('setMainExamDoctorDict', data.data)
            } else {
              commit('setExamDoctorDict', data.data)
            }
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getHisImplementDict ({ state, commit }, btn = false) {
      if (state.hisImplementDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        hisImplementDeptList({}).then(({ data }) => {
          // console.log(data)
          if (data.code == 0) {
            commit('setHisImplementDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getExpenseTypeDict ({ state, commit }, btn = false) {
      if (state.expenseTypeDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        expenseTypeList({}).then(({ data }) => {
          if (data.code == 0) {
            console.log(data)
            commit('setExpenseTypeDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getPersonSourceDict ({ state, commit }, btn = false) {
      if (state.personSourceDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        personSourceList({}).then(({ data }) => {
          if (data.code == 0) {
            console.log(data)
            commit('setPersonSourceDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getCheckDoctorDict ({ state, commit }, btn = false) {
      if (state.roomDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        checkDoctorMaintenanceList({}).then(({ data }) => {
          if (data.code == 0) {
            console.log(data.data)
            commit('setCheckDoctorDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getOrgDict ({ state, commit }, btn = false) {
      if (state.orgDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        orgList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setOrgDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },

    getMedicalInsuranceDict ({ state, commit }, btn = false) {
      if (state.medicalInsuranceDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        medicalInsuranceList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setMedicalInsuranceDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    },
    getMainConclusionDict ({ state, commit }, btn = false) {
      if (state.mainConclusionDict.length > 0 && !btn) {
        return false
      }
      return new Promise((resolve, reject) => {
        mainConclusionList({}).then(({ data }) => {
          if (data.code == 0) {
            commit('setMainConclusionDict', data.data)
          }
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
