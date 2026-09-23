/* SpanLab: a small, inspectable instance-based sequence labeler. No server or API key. */
const LEVELS = {L6:'Số nhà', L5:'Đường', L4:'Phường / xã', L3:'Quận / huyện', L2:'Tỉnh / thành phố'};
const TAGS = ['O', ...Object.keys(LEVELS).flatMap(level => [`B-${level}`, `I-${level}`])];
const seed = [
  ['12 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh', ['B-L6','B-L5','I-L5','O','B-L4','I-L4','I-L4','O','B-L3','I-L3','O','B-L2','I-L2','I-L2','I-L2']],
  ['45 Lê Lợi, Phường Phú Hội, Thành phố Huế', ['B-L6','B-L5','I-L5','O','B-L4','I-L4','I-L4','O','B-L2','I-L2','I-L2']],
  ['88 Trần Hưng Đạo, Phường Cửa Nam, Hà Nội', ['B-L6','B-L5','I-L5','I-L5','O','B-L4','I-L4','I-L4','O','B-L2','I-L2']],
  ['16 Đường số 3, Phường An Khánh, Thành phố Thủ Đức, Thành phố Hồ Chí Minh', ['B-L6','B-L5','I-L5','I-L5','O','B-L4','I-L4','I-L4','O','B-L3','I-L3','I-L3','I-L3','O','B-L2','I-L2','I-L2','I-L2','I-L2']],
  ['120 Võ Văn Tần, Phường Xuân Hòa, Quận 3, TP. Hồ Chí Minh', ['B-L6','B-L5','I-L5','I-L5','O','B-L4','I-L4','I-L4','O','B-L3','I-L3','O','B-L2','I-L2','I-L2','I-L2']]
];
const exercises = [
  ['27 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh', ['B-L6','B-L5','I-L5','I-L5','O','B-L4','I-L4','I-L4','O','B-L3','I-L3','O','B-L2','I-L2','I-L2','I-L2']],
  ['103 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP. Hồ Chí Minh', ['B-L6','B-L5','I-L5','I-L5','O','B-L4','I-L4','O','B-L3','I-L3','I-L3','O','B-L2','I-L2','I-L2','I-L2']],
  ['5 Hai Bà Trưng, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội', ['B-L6','B-L5','I-L5','I-L5','O','B-L4','I-L4','I-L4','O','B-L3','I-L3','I-L3','O','B-L2','I-L2']],
  ['9 Phan Đình Phùng, Phường Quán Thánh, Quận Ba Đình, Hà Nội', ['B-L6','B-L5','I-L5','I-L5','O','B-L4','I-L4','I-L4','O','B-L3','I-L3','I-L3','O','B-L2','I-L2']]
];
// Spaces delimit words; commas are separate tokens. The examples deliberately avoid ambiguous abbreviations.
function tokenize(s) { return s.match(/[^\s,]+|,/gu) || []; }
function validate(items) { for (const [s,t] of items) if (tokenize(s).length !== t.length) throw Error(`Token/label mismatch: ${s} (${tokenize(s).length} / ${t.length})`); }
validate(seed); validate(exercises);
const KEY='spanlab-v1';
let state;
try { state=JSON.parse(localStorage.getItem(KEY)); } catch { state=null; }
if (!state || !Array.isArray(state.learned) || !Number.isInteger(state.index)) state={index:0,learned:[],attempts:[]};
let current=[], selected='B-L6', checked=false, prediction=[];
const $=id=>document.getElementById(id);
function persist(){localStorage.setItem(KEY,JSON.stringify(state));}
function example(){return exercises[state.index % exercises.length];}
function normalize(s){return s.toLocaleLowerCase('vi').normalize('NFC');}
function features(tokens,i){
  const word=normalize(tokens[i]), prev=normalize(tokens[i-1]||'^'), next=normalize(tokens[i+1]||'$');
  return new Set([`w:${word}`,`pre:${word.slice(0,3)}`,`suf:${word.slice(-3)}`,`p:${prev}`,`n:${next}`,
    `digit:${/^\d+[\w/.-]*$/u.test(word)}`,`punct:${word===','}`,`capital:${/^\p{Lu}/u.test(tokens[i])}`,
    `after-comma:${prev===','}`,`before-comma:${next===','}`]);
}
function vectors(){
  return [...seed,...state.learned].flatMap(([s,tags])=>tokenize(s).map((_,i,tokens)=>({f:features(tokens,i),tag:tags[i]})));
}
function similarity(a,b){let score=0;for(const f of a)if(b.has(f))score+=f.startsWith('w:')?5:f.startsWith('p:')||f.startsWith('n:')?2:1;return score;}
function classify(tokens){
  const train=vectors();let previous='O';
  return tokens.map((_,i)=>{
    const f=features(tokens,i);
    const neighbors=train.map((r,j)=>({tag:r.tag,score:similarity(f,r.f),j})).sort((a,b)=>b.score-a.score||a.j-b.j).slice(0,9);
    const votes={};for(const n of neighbors)votes[n.tag]=(votes[n.tag]||0)+Math.max(.05,n.score);
    if(tokens[i]===','){previous='O';return {tag:'O',confidence:1};}
    const ranked=Object.entries(votes).sort((a,b)=>b[1]-a[1]);
    let tag=ranked[0]?.[0]||'O';
    // BIO legality: I-X requires an immediately preceding B-X or I-X.
    if(tag.startsWith('I-') && previous.slice(2)!==tag.slice(2))tag='B-'+tag.slice(2);
    const confidence=(ranked[0]?.[1]||0)/(Object.values(votes).reduce((a,b)=>a+b,0)||1);
    previous=tag;return {tag,confidence};
  });
}
function displayTag(tag){if(!tag)return 'Chưa gán';if(tag==='O')return 'O';return tag.replace(/(B|I)-L(\d)/,(_,bi,n)=>`${bi}·L${n}`);}
function render(){
  const [s]=example(), words=tokenize(s);
  $('exampleNo').textContent=(state.index%exercises.length)+1;
  $('total').textContent=exercises.length;
  $('trained').textContent=state.learned.length;
  const total=state.attempts.reduce((a,x)=>a+x.total,0), correct=state.attempts.reduce((a,x)=>a+x.correct,0);
  $('accuracy').textContent=total?Math.round(correct/total*100)+'%':'—';
  $('mode').textContent=checked?'ĐÃ KIỂM TRA':'GÁN NHÃN';
  $('save').disabled=!checked;
  $('tokens').replaceChildren(...words.map((word,i)=>{
    const btn=document.createElement('button');btn.className='token';btn.dataset.label=current[i]||'';
    const main=document.createElement('span');main.textContent=word;const tag=document.createElement('span');tag.className='tag';tag.textContent=displayTag(current[i]);
    btn.append(main,tag);btn.title=prediction[i]?`Máy đoán: ${prediction[i].tag} (${Math.round(prediction[i].confidence*100)}% phiếu)`:'Bấm để gán nhãn';
    btn.onclick=()=>{if(checked)return;current[i]=selected;render();$('feedback').textContent=`Đã gán “${word}” → ${selected}.`;};return btn;
  }));
  $('labels').replaceChildren(...TAGS.map(tag=>{const btn=document.createElement('button');btn.className='label'+(selected===tag?' selected':'');btn.textContent=tag==='O'?'O · Bên ngoài':`${tag} · ${LEVELS[tag.slice(2)]}`;btn.onclick=()=>{selected=tag;render();};return btn;}));
}
$('predict').onclick=()=>{if(checked)return;const words=tokenize(example()[0]);prediction=classify(words);current=prediction.map(x=>x.tag);render();$('feedback').textContent=`Máy đã gán ${words.length} từ. Di chuột qua từng từ để xem điểm phiếu; hãy sửa các nhãn trước khi kiểm tra.`;};
$('check').onclick=()=>{
  if(checked)return;const gold=example()[1];if(current.length!==gold.length||current.some(x=>!x)){$('feedback').textContent='Hãy gán nhãn cho tất cả các từ trước khi kiểm tra.';return;}
  let correct=0;gold.forEach((g,i)=>{if(current[i]===g)correct++;else $('tokens').children[i].classList.add('wrong');});
  checked=true;state.attempts.push({correct,total:gold.length});persist();render();
  gold.forEach((g,i)=>{if(current[i]!==g){$('tokens').children[i].classList.add('wrong');$('tokens').children[i].title=`Đáp án: ${g}; bạn chọn: ${current[i]}`;}});
  $('feedback').textContent=`Đúng ${correct}/${gold.length} từ. Viền đỏ là chỗ cần sửa; di chuột để xem đáp án. Nhấn “Lưu” để dạy máy bằng nhãn chuẩn.`;
};
$('save').onclick=()=>{if(!checked)return;state.learned.push(example());state.index++;persist();current=[];prediction=[];checked=false;render();$('feedback').textContent='Đã thêm ví dụ vào bộ nhớ mô hình. Hãy thử “Máy thử đoán” để thấy sự thay đổi.';};
$('reset').onclick=()=>{if(!confirm('Xóa tiến độ học trên trình duyệt này?'))return;state={index:0,learned:[],attempts:[]};persist();current=[];prediction=[];checked=false;render();$('feedback').textContent='Đã đặt lại tiến độ.';};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({format:'SpanLab BIO v1',examples:state.learned},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='spanlab-learned.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
render();
