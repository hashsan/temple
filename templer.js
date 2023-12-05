function randomid(){
  return 'id'+Math.random().toString(36).slice(-8)  
}
function istitle(line){
  const re=/^＃/;
  return re.test(line)
}
function isimg(line){
  const re=/\.(jpeg|jpg|gif|png|tiff|bmp|avif|webp)/i;
  return re.test(line)
}
function islink(line){
  const re=/\.(html|htm|txt)/i;
  return re.test(line)
}
function divide(line,def){
  def = def||'リンク'
  const re=/：/
  if(!re.test(line)){
    return {name:def,url:line}
  }
  const ary=line.split('：')
  return {name:ary[0],url:ary[1]}
}
function iskaigyo(line){
  return !!(line === '')
}

function parse(line){
  if(istitle(line)){
    const id = randomid()
    return `<h2 id="${id}">${line}</h2>`
  }
  if(isimg(line)){
    const {url,name} = divide(line,'画像')
    return `<p><a data-img="${url}">${name}</a></p>`
  }
  if(islink(line)){
    const {url,name} = divide(line,'リンク')
    return `<p><a href="${url}" target="_blank">${name}</a></p>`
  }
  if(iskaigyo(line)){
    return `<p><br></p>`
  }  
  return `<p>${line}</p>`
}

export function templer(temp){
  const br ='\n'
  const html = temp.trimStart().split(br).map(parse).join(br)
  return '<div class="templer frame pre">'+html+'</div>'
}

if(window) window.templer = templer
