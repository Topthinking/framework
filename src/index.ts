let elementFn: any = null;
const doms: any = [];

const refName = Symbol("ref");

const ref = (v) => {
  const obj = {
    value: v,
    refName,
  };
  const effects = [];
  return new Proxy(obj, {
    get(target, key) {
      if (elementFn) {
        doms.push(elementFn);
      }
      return Reflect.get(target, key);
    },
    set(target, key, val) {
      const res = Reflect.set(target, key, val);
      doms.forEach((dom) => {
        dom();
      });
      return res;
    },
  });
};

export const useState = (value): any => {
  const v = ref(value);
  const setV = (_v) => {
    v.value = _v;
  };
  return [v, setV];
};

const h = (type, props, ...children) => {
  const newChildren: any = [];
  elementFn = () => {
    const newChildren: any = [];
    children.forEach((child) => {
      if (child.refName === refName) {
        newChildren.push(child.value);
      } else {
        newChildren.push(child.instance || child);
      }
    });
    if (obj.instance) {
      var fragment = document.createDocumentFragment();
      newChildren.forEach((item) => {
        if (!(item instanceof HTMLElement)) {
          fragment.appendChild(document.createTextNode(item));
        } else {
          fragment.appendChild(item);
        }
      });
      obj.instance.innerHTML = "";
      obj.instance.appendChild(fragment);
    }
  };
  let hasRef = false;
  children.forEach((child) => {
    if (child.refName === refName) {
      hasRef = true;
      newChildren.push(child.value);
    } else {
      newChildren.push(child);
    }
  });
  if (!hasRef) {
    doms.pop();
  }
  const obj: any = {
    type,
    props,
    instance: null,
    children: newChildren,
  };
  elementFn = null;
  return obj;
};

export const render = (instance, ele) => {
  const el = instance();
  const loop = (ve) => {
    if (ve.children) {
      let childInfo = "";
      const dom = document.createElement(ve.type);
      ve.children.forEach((child) => {
        const info = loop(child);
        if (!(info instanceof HTMLElement)) {
          childInfo += info;
        } else {
          child.instance = info;
          dom.appendChild(info);
        }
      });

      dom.appendChild(document.createTextNode(childInfo));
      if (ve.props && ve.props.onClick) {
        dom.onclick = ve.props.onClick;
      }
      return dom;
    } else {
      return ve;
    }
  };
  const result = loop(el);
  el.instance = result;
  ele.appendChild(result);
};

export const jsx = h;
