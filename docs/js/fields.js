const fieldGroups = [
  {
    id: `greet`,
    groupName: `Greeting`,
    title: `Account registration form`,
    subtitle: `takes only 5min`,
    btnText: `advance`
  },
  {
    id: `pInfo`,
    groupName: "Personal info",
    fields: [
      {
        fieldName: "name",
        placeholder: "Enter name",
        inputType: "text",
        iconSrc: `res/user.png`,
        required: true
      },
      {
        fieldName: "lName",
        placeholder: "Enter last name",
        inputType: "text",
        iconSrc: `res/info.png`,
        required: true
      },
      {
        fieldName: "os",
        tagType: "select",
        children:[
          {
            tagType: "option",
            props:{selected:!navigator.appVersion.includes("Win")||navigator.appVersion.includes("Linux")||navigator.appVersion.includes("Mac"), disabled:true},
            text:"Select preferred OS"
          },
          {
            tagType: "option",
            props:{selected:navigator.appVersion.includes("Win")},
            text:"Windows"
          },
          {
            tagType: "option",
            props:{selected:navigator.appVersion.includes("Linux")},
            text:"Linux"
          },
          {
            tagType: "option",
            props:{selected:navigator.appVersion.includes("Mac")},
            text:"Mac OS"
          }
        ],
        iconSrc: `res/sysInfo.png`,
        required: true
      },
      {
        fieldName: "browser",
        tagType: "select",
        children:(() => {
          let browser;

          if(navigator.userAgent.includes("Chrome") && !!window.chrome){
            browser = "Chrome";
          }else if(navigator.userAgent.includes("Firefox")){
            browser = "Firefox";
          }else if(navigator.userAgent.includes("Safari")){
            browser = "Safari";
          }else if((navigator.userAgent.includes("Opera") || navigator.userAgent.includes("OPR")) && (!!window.opr || !!window.opera)){
            browser = "Opera";
          }else if(navigator.userAgent.includes("MSIE") || !!document.documentMode){
            browser = "IE";
          }

          return [{
              tagType: "option",
              props:{selected:!browser, disabled:true},
              text:"Select preferred Browser"
            },
            {
              tagType: "option",
              props:{selected:browser === "Chrome"},
              text:"Chrome"
            },
            {
              tagType: "option",
              props:{selected:browser === "Firefox"},
              text:"Firefox"
            },
            {
              tagType: "option",
              props:{selected:browser === "Safari"},
              text:"Safari"
            },
            {
              tagType: "option",
              props:{selected:browser === "Opera"},
              text:"Opera"
            },
            {
              tagType: "option",
              props:{selected:browser === "IE"},
              text:"Internet Explorer"
            }]
          }
        )(),
        iconSrc: `res/sysInfo.png`,
        required: true
      }
    ]
  },
  {
    id: `aInfo`,
    groupName: "Account info",
    fields: [
      {
        fieldName: "name",
        inputType: "text",
        placeholder: "Enter your desired username",
        iconSrc: `res/user.png`,
        required: true
      },
      {
        fieldName: "password",
        placeholder: "Enter password",
        inputType: "password",
        iconSrc: `res/password.png`,
        props: {
          pattern: `.{9}.*`,
          title: `password must contain at least 9 letters`
        },
        required: true
      },
      {
        fieldName: "cpassword",
        placeholder: "Confirm password",
        inputType: "password",
        iconSrc: `res/password.png`,
        props: {
          pattern: `.{9}.*`,
          title: `password must contain at least 9 letters`
        },
        required: true
      }
    ],
    passParam: data => data.password === data.cpassword
  },
  {
    id: `finish`,
    groupName: `Submit the form`,
    title: `Please review your forms`,
    subtitle: `submit the form if you want to share this information`,
    btnText: `send`,
    completeMessage: `thank you for your time`
  }
];
