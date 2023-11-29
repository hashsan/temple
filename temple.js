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
    const isText=(file)=>{
       return /\.txt/.test(file)
    }
    fn.q('.btnindex').onclick=()=>{
      fn.getIndexInfo(this.saveurl,getGhp())
       .then(ary=>{
          console.log('in then')        
        var html = ary.filter(d=>isText(d.path)).map(d=>{
          console.log('in')
        //{sha,date,message,path,order}
         return `<a href="index.html?file=${d.path}"
         style="order:${d.order}">${d.date} | ${d.message} | ${d.path}</a>`
        }).join('\n')
        ;
        this.index.innerHTML= html
      })
    }

    ;
    function getGhp(){
      var d = "ghp_"
      /**/
      + "9ah8c3yojjO"
      + "EsWBOP6CSiMAMj"
      + "mcDcF1UGrhv"    
      return d;
    }

  }
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

