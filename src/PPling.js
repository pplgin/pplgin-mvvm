
export default class PPling {
  constructor(opt) {
    this.$el = document.querySelector(opt.el)
    this.data = new Proxy(opt.data, this._proxy())
    this._methods =  Object.assign({}, opt.methods) || {}
    this._bindkeys = {};
    this._tempReg = /{{(.*?)}}/ig;
    this._compile(this.$el);
  }

  /**
   * 数据处理 数据监听
   * @author  johnnyjiang
   * @email               johnnyjiang813@gmail.com
   * @createTime          2017-05-24T10:57:55+0800
   */
  _proxy() {
    return {
      set: (obj, prop, value) => {
        // The default behavior to store the value
        obj[prop] = value;

        this._bindkeys[prop] && this._bindkeys[prop].forEach((item)=>{
          item.ele[item.commend] = value
        });
        return true;
      }
    }
  }

  /**
   * 编译
   * @author  johnnyjiang
   * @email               johnnyjiang813@gmail.com
   * @createTime          2017-05-24T10:58:21+0800
   */
  _compile($el) {
    const {data ,_bindkeys, _tempReg, _methods} = this;
    let nodes = $el.children;

    for (var i = nodes.length - 1; i >= 0; i--) {
      let node = nodes[i];
      if(node.children.length){
        // recursive
        this._compile(node);
      } else {
        let matchItems = node.innerHTML.match(_tempReg);

        // match {{}} list
        if(matchItems && matchItems.length){
          // match all bindkey
          let newKeys = matchItems.map(function(ele) {
            return ele.replace(_tempReg,'$1');
          });

          // keep old content
          let textNodes = node.innerHTML.split(_tempReg);

          // remove all inner
          node.innerHTML = null;
          textNodes.forEach((key)=>{
            let el = document.createTextNode('');
            if(newKeys.indexOf(key) !== -1 ){
              // init bind
              el.nodeValue = data.hasOwnProperty(key) ? data[key] : 'undefinded'
            } else {
              el.nodeValue = key
            }
            node.append(el);
            // save bind key
            _bindkeys[key] = _bindkeys.hasOwnProperty(key) ? _bindkeys[key] : [];
            _bindkeys[key].push({
              ele: el,
              commend: 'nodeValue'
            });
          })
        }

        // input ||  textarea
        if (node.hasAttribute('pp-model') && node.getAttribute('pp-model')) {
          let bindkey = node.getAttribute('pp-model');
          _bindkeys[bindkey] = _bindkeys.hasOwnProperty(bindkey) ? _bindkeys[bindkey] : [];
          _bindkeys[bindkey].push({
            ele: node,
            commend: 'value'
          })

          if(bindkey in data){
            node.value = data[bindkey]
          }
          node.addEventListener('keyup', (e) => {
            data[bindkey] = e.target.value
          }, false)
        }

        // click
        if (node.hasAttribute('pp-click') && node.getAttribute('pp-click')){
          let methodStr = node.getAttribute('pp-click');
          // get metch name
          let methodName = methodStr.replace(/(\([^\)]*\))$/,'');
          let methodParams = methodStr.replace(/^\w*(\([^\)]*\))$/ig,(x,$1)=>{
            return $1
          });

          let _params = methodParams.replace(/\(|\)/,'').split(',');
          // check method
          if(_methods.hasOwnProperty(methodName)){
            node.addEventListener('click',(e)=>{
              _methods[methodName].apply(this, [e,..._params])
            }, false)
          }
        }
      }
    }
  }
}