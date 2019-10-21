// define mobile and desktop constants
const MOBILE = 1;
const DESKTOP = 2;

const fieldGroupDiv = document.getElementById("fieldGroups");
const formScreenDiv = document.getElementById("formScreenDiv");
const mobileWindowWidth = 800;
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
  }else{
    if(fieldGroupDiv.childElementCount > 0)
      fieldGroupDiv.innerHTML = ``
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
      //const formDataId = e.path.filter(elem => elem.id && elem.id.includes(`_screen`))[0].id.replace(`_screen`, ``)
      fieldGroups[groupSelectedIndex].completed = true;
      const formDataIndex = groupSelectedIndex+1;
      setGroupSelectedIndex(formDataIndex);
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
          field.inputType? applyCustomProps(createDomWithClass(`input`, null, `${formData.id}_${field.fieldName}`), {
            name:field.fieldName,
            type:field.inputType,
            required:field.required,
            placeholder:field.placeholder || ``,
            ...(field.props)
          }) : applyCustomProps(createDomWithChildren(field.tagType, 
            (field.children && field.children.map(child => applyCustomProps(createDomWithText(child.tagType, child.text), child.props))) || []
          , `${formData.id}_${field.fieldName}`), {
            name:field.fieldName,
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
              applyEventListener(createDomWithText(`h3`,fieldGroupData.groupName, `sectionHeader`), `click`,  () => {
                setGroupSelected(fieldGroupData.id);
                refreshScreen(displayed);
              }),
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
          applyEventListener(createDomWithText(`button`, formData.btnText), `click`, () => {
            fieldGroups[getGroupIndex('finish')].completed = true;
            refreshScreen(displayed);

            const dataOut = {};
            fieldGroups.filter(e => e.data).forEach(e => {
              dataOut[e.id] = e.data
            })
            console.log(dataOut)
          }),{
            disabled:completedFieldGroups.length != shouldBeCompleted.length,
            type:`button`
          })
      ], `formDataBottom`)
    ], `finishScreenBody`)
  ], `${groupSelected===formData.id?`selected `:``}screen finishScreen`, `${formData.id}_screen`)  
}


const displayForm = screenType => {
  if(formScreenDiv.childElementCount > 0)
    formScreenDiv.innerHTML = ``

  if(screenType == DESKTOP || true){
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
  if(dom){
    dom.innerHTML = ``;
    const newDom = finishScreen(fieldGroups[getGroupIndex(`finish`)], screenType);
    Array.from(newDom.childNodes).forEach(e => {
      dom.append(e);
    })
  }
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

const testDiv = document.getElementById(`respondTest_form`)
let cmp = new Component(cmpSetState => 
  div({ class:`todoList` },
    [
      customVDom(`ul`, {}, ({ todos }) => 
        todos.map((todo, i) => 
          customVDom(`li`, { style:{textDecoration:todo.done?`line-through`:`none`} }, [
            text(todo.name),
            customVDom(`input`, {type:`checkbox`, checked:todo.done, disabled:todo.done, onchange:e => {
              const todosChange = todos
              todosChange[i].done = e.target.checked
              cmpSetState({ todos:todosChange })
              setTimeout(() => {
                cmpSetState({ todos:todos.filter(t => t != todo) })
              }, 1000);
            }})
          ])
        )
      , [`todos`]),
      div({}, [
        text(`add new todo: `),
        customVDom(`form`, {onsubmit:e => {
          e.preventDefault()
        }}, ({ newTodo }) => [
          customVDom(`input`, { type: `text`, value:newTodo, onchange:e => {
            cmpSetState({ newTodo: e.target.value })
          }}),
          customVDom(`input`, { type: `submit` , onclick:() => {
            cmpSetState(({ newTodo, todos }) => ({ todos:todos.concat({ name:newTodo }), newTodo:"" }))
          }})
        ],[`newTodo`])
      ])
    ]
  ),
  {todos:[{name:`drink fluid`, done:false}], newTodo:""},
  testDiv
)