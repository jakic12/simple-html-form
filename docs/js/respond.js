function* componentUuid(){
  let i = 0;
  while(true){
    yield(`component_${i}`);
  }
}

const cUuid1 = componentUuid();

const div = (props, render, usedStateProps = []) => ({type:`div`, render, props, usedStateProps})
const customVDom = (type, props, render, usedStateProps = []) => ({type, render, props, usedStateProps})
const text = (render, usedStateProps = []) => ({type:`text`, render, usedStateProps})
/**
 * 
 * @param {Object} domStructFnct parent VDom
 * @param {Object} initialState 
 */
function Component(
  domStructFnct,
  initialState = {},
  parent
){
  this.state = initialState;
  this.stateListeners = {}

  this.addStateListener = (prop, vDom) => {
    if(this.stateListeners[prop]){
      if(!this.stateListeners[prop].includes(vDom))
        this.stateListeners[prop].push(vDom)
    }else
      this.stateListeners[prop] = [ vDom ]
  }

  this.removeStateListener = (prop, dom) => {
    this.stateListeners[prop] = this.stateListeners[prop].filter(d => d != dom)
  }

  this.renderDomStructure = (VDom, addeventlistener = true) => {
    let out;

    if(VDom.render){
      if(VDom.type === `text` || VDom instanceof String){
        if(VDom.render instanceof Function){
          out = document.createTextNode(VDom.render(this.state));
        }else{
          out = document.createTextNode(VDom.type? VDom.render : VDom)
        }
      }else{
        if(VDom.render instanceof Array){
          out = createDomWithChildren(
            VDom.type,
            VDom.render.map(e => this.renderDomStructure(e))
          )
        }else if(VDom.render instanceof Function){
          const renderOut = VDom.render(this.state);
          if(renderOut instanceof Array){
            out = createDomWithChildren(
              VDom.type,
              renderOut.map(e => this.renderDomStructure(e))
            )
          }else{
            out = createDomWithChild(VDom.type, this.renderDomStructure(renderOut))
          }
        }else{
          out = createDomWithChild(VDom.type, this.renderDomStructure(VDom.render))
        }
      }
    }else{
      out = document.createElement(VDom.type);
    }

    if(VDom.props){
      out = applyCustomProps(out, VDom.props);
    }

    if(addeventlistener && VDom.usedStateProps && VDom.usedStateProps.length > 0){
      VDom.usedStateProps.forEach(prop => {
        this.addStateListener(prop, VDom)
      })
    }
    VDom.dom = out;
    return out;
  }

  this.setState = (newState, callback) => {
    if(newState instanceof Function){
      newState = newState(this.state)
    }
    this.state = Object.assign(this.state, newState)

    for(prop in newState){
      if(this.stateListeners && this.stateListeners[prop] && this.stateListeners[prop] instanceof Array)
        this.stateListeners[prop].forEach(vdom => {
          if(vdom.type === `text`){
            if(vdom.render instanceof Function){
              vdom.dom.data = vdom.render(this.state);
            }else{
              vdom.dom.data = vdom.render
            }
          }else{
            const oldElement = vdom.dom;
            this.renderDomStructure(vdom);
            oldElement.parentElement.replaceChild(vdom.dom, oldElement)
          }
        })
    }

    if(callback)
      callback(this.state)
  }

  const domStruct = domStructFnct(this.setState);

  const domOut = this.renderDomStructure(domStruct);

  if(parent)
    parent.appendChild(domOut)
}