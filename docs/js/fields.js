const fieldGroups = [
  {
    id:`greet`,
    groupName:`Greeting`,
    title:`Job application form`,
    subtitle:`takes only 5min`,
    btnText:`advance`
  },
  {
    id:`pInfo`,
    groupName:"Personal info",
    fields:[
      {
        fieldName:"name",
        placeholder:"Enter name",
        inputType:"text",
        iconSrc:`res/user.png`,
        required:true
      },
      {
        fieldName:"lName",
        placeholder:"Enter last name",
        inputType:"text",
        iconSrc:`res/info.png`,
        required:true
      },
      {
        fieldName:"os",
        placeholder:"Enter your operating system",
        inputType:"text",
        iconSrc:`res/sysInfo.png`,
        required:true
      }
    ]
  },
  {
    id:`jInfo`,
    groupName:"Account info",
    fields:[
      {
        fieldName:"name",
        inputType:"text",
        placeholder:"Enter your desired username",
        iconSrc:`res/user.png`,
        required:true
      },
      {
        fieldName:"password",
        placeholder:"Enter password",
        inputType:"password",
        iconSrc:`res/password.png`,
        props:{
          pattern:`.{9}.*`,
          title:`password must contain at least 9 letters`
        },
        required:true
      },
      {
        fieldName:"cpassword",
        placeholder:"Confirm password",
        inputType:"password",
        iconSrc:`res/password.png`,
        props:{
          pattern:`.{9}.*`,
          title:`password must contain at least 9 letters`
        },
        required:true
      }
    ],
    passParam:data => data.password === data.cpassword
  },
  {
    id:`finish`,
    groupName:`Submit the form`,
    title:`Please review your forms`,
    subtitle:`submit the form if you want to share this information`,
    btnText:`send`,
    completeMessage:`thank you for your time`
  },
]