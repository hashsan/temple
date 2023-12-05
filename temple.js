/*
v1 coded
v2 initIndex remake
v3 index clear
v4 delete old
*/

import "//hashsan.github.io/use/use.js?v=43"
import "https://hashsan.github.io/drop/drop.js"
import "https://hashsan.github.io/drop/upimage.js"


export default class Temple{
  needsave
  constructor(query,file){
    this.file = this.getFile()
    if(file){
      this.file = file;
      console.log('file fixed',file)
    }
    if(!this.file){
      return this.reload();
    }
    this.ed = this.getEditor(query)

    this.init()
    this.saveMissBlock()

  }
  init(){
    const _keydown = fn.debounce(this.keydown,160)
    this.ed.onkeydown = _keydown.bind(this)

    const color ='#BE8336';
    fn.ctrl_s(this.file,color).then(d=>{ this.update() })

    this.initDrop()
    this.initImg()
    this.initIndex()

  }
initIndex(){
  const q="footer .index"
  this.saveurl = "https://hashsan.github.io/ctrl_s/index.html"
  this.index = fn.q(q)
  //console.log(this.index)
  fn.q('.btnindex').onclick=()=>{
    this.index.innerHTML= '' //clear
    fn.renderIndex(this.saveurl,(d)=>{

      if(!/\.txt/.test(d.path)){
        return
      }

      const title = d.message.split(/\s/).at(0)
      const date = d.date.split('T').at(0).replace(/-/g,'/')
      const link = 'index.html?file='+d.path
      var el = document.createElement('div')
      el.innerHTML=`
    <a href="${link}" style="order:${d.order}">
     ${title}
     <span class="small">${d.path} ${date}</span>
    </a>
    `
      el = el.children[0]
      fn.q(q).append(el)

    }) 
  }

}

  
/*v4*/
  
  initImg(){
    const q ="article .img"
    this.img = fn.q(q)
    this.img.onclick=()=>{
      fn.copy(this.img.src)
    }    
    fn.doubleclick(q,(el)=>{
      el.src = ''
    })

    const q2="article .imglist"
    this.imglist = fn.q(q2)
    this.imglist.onclick=(e)=>{
      if(!e.target.dataset.src){
        return
      }
      this.img.src = e.target.dataset.src
    }

  }
  initDrop(){
    this.dropimg = ''
    drop(async file=>{      
      this.dropimg = await upimage(file)
      this.setImage()
    },400)
  }
  getEditor=(query)=>{
    query=query||'[contenteditable]'
    const ed = fn.q(query)
    if(!ed){
      throw new Error('query or contenteditable nothing')
      return
    }
    return ed
  }
  getFile=()=>{
    return fn.URL.get().file
  }
  reload(){
    const u = new URL(location.href)

    const head ='f'+fn.makeday()+'_'
    const name = head+fn.rkana(6)+'.txt'
    u.searchParams.set('file',name)
    //console.log(u.href)
    location.href = u.href;    
  }
  getData=()=>{
    return this.ed.innerHTML
  }

  keydown=(e)=>{
    if(e.ctrlKey && e.key ==='s'){
      this.needsave = false;
      return;
    }
    this.needsave = true
    this.update()
  }
  async update(){
    this.textinfo = fn.textinfo(this.getData())
    this.setTitles()
    this.setImage()
    this.setCRC()
    this.setLink()
  }

  async setLink(){
    var a = this.textinfo.link;
    if(!a){
      return
    }
    fn.q('.nextlink').href = a;
  }
  async setTitles(){
    var ary=this.textinfo.titles.map(d=>'<a>'+d+'</a>')
    fn.q('.title').innerHTML = this.textinfo.title
    for(var el of document.querySelectorAll('nav')){
      el.innerHTML = ary.join('\n')
    }
  }
  async setCRC(){
    this.ed.dataset.crc=this.textinfo.crc
  }
  async setImage(){
    this.ed.dataset.img = this.textinfo.img
    var ary = this.textinfo.imgs
    if(this.dropimg){
      ary.push(this.dropimg)
    }
    var ary=ary.map((d,i)=>`<a data-src="${d}">画像${i}</a>`)
    fn.q('.imglist').innerHTML = ary.join('\n')
    //this.img.src = this.textinfo.img
  }

  saveMissBlock(){
    window.onbeforeunload = (e) =>{ //v4
      if(!this.needsave){
        return
      }
      e.returnValue = "行った変更が保存されません。よろしいですか？";
    }  
  }

}

