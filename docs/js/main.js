// define mobile and desktop constants
const MOBILE = 1;
const DESKTOP = 2;

const fieldGroupDiv = document.getElementById("fieldGroups");
const formScreenDiv = document.getElementById("formScreenDiv");
const mobileWindowWidth = 700;
var displayed = null;

var groupSelected = fieldGroups[0].id;
var groupSelectedIndex = 0;

const setGroupSelected = id => {
  groupSelected = id;
  groupSelectedIndex = getGroupIndex(id);
}

const getGroupIndex = id => {
  for(let i = 0; i < fieldGroups.length; i++){
    if(fieldGroups[i].id === id){
      return i;
    }
  }
}

const setGroupSelectedIndex = index => {
  groupSelectedIndex = index;
  groupSelected = fieldGroups[index].id;
}

const applyCustomProps = (element, props) => {
  for(const key in props){
    element[key] = props[key]
  }
  return element;
}

const applyEventListener = (element, eventListener, callback) => {
  console.log(element.className, callback)
  element.addEventListener(eventListener, callback);
  return element
}

const createDomWithClass = (elementType, className, id) => {
  const out = document.createElement(elementType);
  if(className)
    out.className = className;

  if(id)
    out.id = id;

  return out;
}

const createDomWithText = (elementType, text, className, id) => {
  const out = document.createElement(elementType);
  if(className)
    out.className = className;

  if(id)
    out.id = id;
  
  if(text)
    out.innerText = text;

  return out;
}

const createDomWithChild = (elementType, childElement, className, id) => {
  const out = document.createElement(elementType);
  if(className)
    out.className = className;

  if(id)
    out.id = id;
  
  if(childElement)
    out.appendChild(childElement);
  
  return out;
}

const createDomWithChildren = (elementType, childElements, className, id) => {
  const out = document.createElement(elementType);
  if(className)
    out.className = className;

  if(id)
    out.id = id;

  if(childElements)
    childElements.forEach(child => {
      if(child)
        out.appendChild(child);
    })
  
  return out;
}

const refreshClassNames = () => {
  fieldGroups.forEach(fieldGroupData => {
    const fieldGroupDom = document.getElementById(fieldGroupData.id)
    if(fieldGroupDom)
      fieldGroupDom.className = `${fieldGroupData.completed? `completed `:``}fieldGroup ${groupSelected===fieldGroupData.id?`selected`:``}`

    const formScreenDom = document.getElementById(`${fieldGroupData.id}_screen`)
    if(formScreenDom){
      const selected = formScreenDom.className.includes(`selected`)
      if(groupSelected===fieldGroupData.id){
        if(!selected)
          formScreenDom.className = `selected ${formScreenDom.className}`
      }else if(selected){
        formScreenDom.className = formScreenDom.className.replace(`selected `, ``);
      }
    }
  })
}

const displayFormGroup = (screenType) => {
  // render only if screen type is desktop
  if(screenType == DESKTOP){

    // clear field groupDiv if it has elements inside
    if(fieldGroupDiv.childElementCount > 0)
      fieldGroupDiv.innerHTML = ``

    fieldGroups.forEach(fieldGroup => {
      const fieldIcon = createDomWithClass(`div`, `fieldIcon`);
      const groupNameDiv = createDomWithText(`div`, fieldGroup.groupName, `groupName`);
      const fieldGroupLi = createDomWithChildren(
        `li`,
        [
          fieldIcon,
          groupNameDiv
        ],
        `${fieldGroup.completed? `completed `:``}fieldGroup ${groupSelected===fieldGroup.id?`selected`:``}`,
        fieldGroup.id
      )

      fieldGroupLi.addEventListener(`click`, () => {
        document.getElementById(groupSelected).className = document.getElementById(groupSelected).className.replace(` selected`, ``);
        document.getElementById(fieldGroup.id).className += ` selected`;
        fieldGroups[getGroupIndex(`greet`)].completed = true;
        setGroupSelected(fieldGroup.id);
        refreshScreen(screenType);
      })

      fieldGroupDiv.appendChild(fieldGroupLi)
    })
  }
}

const nextButton = (buttonDom, eventListener, className) => {
  if(buttonDom){
    if(buttonDom.className)
      buttonDom.className += ` submitButton`;
    else
      buttonDom.className = ` submitButton`;
  }

  out = createDomWithChildren(`div`, [
    buttonDom || createDomWithText(`button`, `Next`, `submitButton`),
    createDomWithChild(`div`, 
      applyCustomProps(createDomWithClass(`img`, `rightArrow`), {src:`res/rightArrow.png`}),
      `rightArrowWrapper`
    )
  ], `nextButtonWrapper${className? ` ${className}`:``}`)

  if(eventListener)
    out.addEventListener('click', eventListener)
  
  return out;
}

const greetingScreen = (formData, screenType) => {
  const nextButton1 = nextButton(
    createDomWithText(`button`, formData.btnText),
    e => {
      const formDataId = e.path.filter(elem => elem.id && elem.id.includes(`_screen`))[0].id.replace(`_screen`, ``)
      const formDataIndex = getGroupIndex(formDataId);
      fieldGroups[formDataIndex].completed = true;
      setGroupSelectedIndex(formDataIndex+1);
      refreshScreen(screenType);
    }
  )

  return createDomWithChild(`div`,
      createDomWithChildren(`div`, [
        createDomWithText(`h1`, formData.title),
        createDomWithText(`p`, formData.subtitle),
        nextButton1
      ], `greetingScreenInside`),
      `${groupSelected===formData.id?`selected `:``}screen greetingScreen`, `${formData.id}_screen`)
}

const formScreen = (formData, screenType) => {
  return createDomWithChildren(`div`, [
    createDomWithChild(`div`,
      createDomWithText(`h1`,formData.groupName),
    `formHeader`),
    applyEventListener(
      createDomWithChildren(`form`, formData.fields.map(field => 
        createDomWithChildren(`div`, [
          applyCustomProps(createDomWithClass(`img`, `inputIcon`), {
            src:field.iconSrc || `res/qmark.png`
          }),
          applyCustomProps(createDomWithClass(`input`, null, `${formData.id}_${field.fieldName}`), {
            name:field.fieldName,
            type:field.inputType,
            required:field.required,
            placeholder:field.placeholder || ``,
            ...(field.props)
          })
        ], `inputSection`)  
      ).concat([
        createDomWithChild(`div`,
          applyCustomProps(createDomWithClass(`input`), {
            type:`submit`,
            value:formData.btnText || `next`
          }),
        `submitButtonWrapper`),
      ]), `formBody`, `${formData.id}_form`),`submit`,e => {
        e.preventDefault();
        const domFormData = new FormData(document.getElementById(`${formData.id}_form`));
        let dataOut = {};
        for (var pair of domFormData.entries()) {
          dataOut[pair[0]] = pair[1]
        }

        if((formData.passParam && formData.passParam(dataOut)) || !formData.passParam){
          const formDataIndex = getGroupIndex(formData.id);
          fieldGroups[formDataIndex].data = dataOut;
          fieldGroups[formDataIndex].completed = true;
          
          refreshFinishScreen();
          setGroupSelectedIndex(formDataIndex+1);
          refreshScreen(screenType);
        }

      }
    )
  ], `${groupSelected===formData.id?`selected `:``}screen formScreen`, `${formData.id}_screen`)
}

const finishScreen = (formData, screenType) => {
  const completedFieldGroups = fieldGroups.filter(e => e.data);
  const shouldBeCompleted = fieldGroups.filter(e => e.id !== `finish` && e.id !== `greet`)
  return createDomWithChildren(`div`, [
    createDomWithChild(`div`, createDomWithText(`h1`, formData.title), `finishScreenTitle`),
    createDomWithChildren(`div`, [
      createDomWithChildren(`div`, 
        completedFieldGroups.map(fieldGroupData => {
          if(fieldGroupData.id !== `finish` && fieldGroupData.id !== `greet`){
            return createDomWithChildren(`div`, [
              createDomWithText(`h3`,fieldGroupData.groupName, `sectionHeader`),
              document.createElement(`hr`),
              createDomWithChildren(`div`, fieldGroupData.data?Object.keys(fieldGroupData.data).map(fieldKey => 
                createDomWithChildren(`div`, [
                  createDomWithText(`div`, fieldKey, `key`),
                  createDomWithText(`div`, fieldKey.includes(`passw`)? fieldGroupData.data[fieldKey].replace(/./g, `*`) : fieldGroupData.data[fieldKey], `value`)
                ], `dataSection`)  
              ) : [], `sectionBody`)
            ] , `section`)
          }
        })
      , `formDataWrapper`),
      createDomWithChildren(`div`, [
        createDomWithText(`p`, formData.subtitle),
        applyCustomProps(
          createDomWithText(`button`, formData.btnText),{
            disabled:completedFieldGroups.length != shouldBeCompleted.length,
            onclick:() => {
              console.log('working?')
              fieldGroups[getGroupIndex('finish')].completed = true;
              refreshScreen();
            }
          })
      ], `formDataBottom`)
    ], `finishScreenBody`)
  ], `${groupSelected===formData.id?`selected `:``}screen finishScreen`, `${formData.id}_screen`)  
}


const displayForm = screenType => {
  if(formScreenDiv.childElementCount > 0)
    formScreenDiv.innerHTML = ``

  if(screenType == DESKTOP){
    fieldGroups.forEach(fieldGroupData => {
      switch(fieldGroupData.id){
        case `greet`:
          formScreenDiv.appendChild(greetingScreen(fieldGroupData, screenType))
          break;
        case `finish`:
          formScreenDiv.appendChild(finishScreen(fieldGroupData, screenType))
          break;
        default:
          formScreenDiv.appendChild(formScreen(fieldGroupData, screenType))
      }
    })
  }
}

const refreshFinishScreen = screenType => {
  const dom = document.getElementById(`finish_screen`);
  if(dom)
    dom.innerHTML = finishScreen(fieldGroups[getGroupIndex(`finish`)], screenType).innerHTML
}

const refreshScreen = screenType => {
  // re render elements if screen type changes
  if(screenType != displayed){
    displayFormGroup(screenType);
    displayForm(screenType);
    refreshClassNames();
  }else{
    refreshClassNames();
  }
  displayed = screenType;
}

refreshScreen(mobileWindowWidth<window.innerWidth? DESKTOP : MOBILE);
window.addEventListener('resize', e => {
  refreshScreen(mobileWindowWidth<window.innerWidth? DESKTOP : MOBILE);
})
