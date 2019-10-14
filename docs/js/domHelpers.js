const applyCustomProps = (element, props) => {
  for(const key in props){
    if(key === `style`){
      for(const key1 in props[key]){
        element[key][key1] = props[key][key1]
      }
    }else{
      element[key] = props[key]
    }
  }
  return element;
}

const applyEventListener = (element, eventListener, callback) => {
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