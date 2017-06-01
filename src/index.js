import PPling from './PPling'


let app = new PPling({
  el: '#app',
  template: '',
  data: {
    title: '这只是一个简单的测试！',
    name: 'pplgin'
  },
  methods: {
    sayHello: function(){
      this.data.welcome = 'hello world!'
    },
    replaceHello: function(){
      this.data.welcome =  Math.random()*100;
    },
    sayHello1: function(a,b,c){
      this.data.params = `${a}${b}${c}`;
      // this.data.welcome = 'hello world!'
    }
  }
})