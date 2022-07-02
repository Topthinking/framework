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

let hExist: any = null;

const h = (type, props, ...children) => {
  const run = () => {
    let newChildren = "";
    children.forEach((child) => {
      if (child.refName === refName) {
        newChildren += child.value;
      } else {
        newChildren += child;
      }
    });

    if (hExist) {
      hExist.innerText = newChildren;
    } else {
      hExist = document.createElement(type);
      hExist.onclick = props.onClick;
      hExist.innerText = newChildren;
    }
    return hExist;
  };
  elementFn = run;
  const ele = run();
  elementFn = null;
  return ele;
};

export const render = (instance, ele) => {
  const el = instance();
  ele.appendChild(el);
};

export const jsx = h;
