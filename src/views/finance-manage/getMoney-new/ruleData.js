const RULE = {
    data() {
      return {
        rules: {
          contractName: [
            {required: true, message: "请输入合同姓名", trigger: "blur"}
          ],
          contractPhone: [
            {required: true, message: "请输入手机号码", trigger: "blur"}
          ],
          idNumber: [
            {required: true, message: "请输入身份证号", trigger: "blur"}
          ],
          turnoverAmount: [
            {required: true, message: "请输入金额", trigger: "blur"}
          ],
          closingTime: [
            {required: true, message: "请选择合同时间", trigger: "change"}
          ],
          roomNumber: [
            {required: true, message: "请输入房屋房号", trigger: "blur"}
          ],
          housingArea:[
            {required: true, message: "请输入房屋面积", trigger: "blur"}
          ],
          totalHousingPrice: [
            {required: true, message: "请输入房屋总价", trigger: "blur"}
          ],
          commissionReceivable:[
            {required: true, message: "请输入应收佣金", trigger: "blur"}
          ],
          thisCommission:[
              {required: true, message: "请输入本次佣金", trigger: "blur"},
          ],
        },
      }
    },
    methods: {
      submitForm(formName) {
        return new Promise((resolve,reject)=>{
          this.$refs[formName].validate((boolean, obj)=>{
            if(boolean){
              resolve()
            }else {
              reject(obj)
            }
          });
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
  export {
    RULE
  }
  