import { CONSENTS, FIELD_LABELS, PREFECTURES, TERMS_VERSION, validateApplication, displayValue } from './schema.mjs';
import { DELIVERY } from './delivery-config.mjs';

const form=document.querySelector('#application-form');
const review=document.querySelector('#review-panel');
const complete=document.querySelector('#complete-panel');
const summary=document.querySelector('#error-summary');
let currentApplication=null;
let liveController=null;
let liveReady=Promise.resolve();
if(DELIVERY.mode==='live'){
  document.querySelector('#preview-complete').disabled=true;
  document.querySelector('#preview-complete').textContent='送信準備中';
  document.querySelector('.preview-banner').hidden=true;
  document.querySelector('#review-panel > p:not(.eyebrow)').textContent='入力内容をご確認のうえ、申請を送信してください。';
  document.querySelector('.form-actions > small').textContent='ご入力のメールアドレスへ担当者からご連絡します。';
  document.querySelector('#privacy-note p:last-child').textContent='申請情報は開催の調整・対応に必要な期間、安全に管理します。訂正・削除などのお申し出は公式LINEまたは店頭へご連絡ください。';
  liveReady=import('./live-form.mjs').then(({setupLiveForm})=>{liveController=setupLiveForm(DELIVERY,errors=>{review.hidden=true;form.hidden=false;showErrors(errors);});}).catch(()=>{
    const submit=document.querySelector('#preview-complete');submit.disabled=true;submit.textContent='現在フォームからの受付を準備中です';
  });
}
for (const prefecture of PREFECTURES) {
  const option=document.createElement('option');option.value=prefecture;option.textContent=prefecture;form.elements.prefecture.append(option);
}
for (const [key,text] of Object.entries(CONSENTS)) {
  const label=document.createElement('label');label.className='consent-card';
  const input=document.createElement('input');input.type='checkbox';input.name=key;input.id=key;input.required=true;
  const body=document.createElement('span');
  const title=document.createElement('strong');title.textContent=FIELD_LABELS[key];
  const detail=document.createElement('small');detail.textContent=text;
  body.append(title,detail);label.append(input,body);document.querySelector('#consent-list').append(label);
}
for (const control of form.querySelectorAll('input,select,textarea')) {
  const error=document.createElement('span');error.id=`error-${control.name}`;error.className='field-error';error.hidden=true;
  const parent=control.closest('.field,.consent-card');parent.append(error);
  const hint=parent.querySelector('.hint');
  if(hint){hint.id=`hint-${control.name}`;control.setAttribute('aria-describedby',`${hint.id} ${error.id}`);}else control.setAttribute('aria-describedby',error.id);
}
form.elements.organizerType.addEventListener('change',()=>{
  const required=['company','group'].includes(form.elements.organizerType.value);
  form.elements.organization.required=required;
  document.querySelector('#organization-required').textContent=required?'必須':'任意';
  document.querySelector('#organization-required').className=required?'required':'hint';
});

function showErrors(errors) {
  for (const control of form.querySelectorAll('input,select,textarea')) {
    const message=errors[control.name];
    control.setAttribute('aria-invalid',String(!!message));
    const fieldError=document.querySelector(`#error-${control.name}`);fieldError.textContent=message||'';fieldError.hidden=!message;
  }
  summary.replaceChildren();summary.hidden=Object.keys(errors).length===0;
  if(!summary.hidden){
    const p=document.createElement('p');p.textContent='入力内容や確認事項をご確認ください。';summary.append(p);
    const list=document.createElement('ul');
    for(const [key,message] of Object.entries(errors)){
      const li=document.createElement('li');
      const control=form.elements.namedItem(key);
      if(control){
        const a=document.createElement('a');a.href=`#${control.id}`;a.textContent=`${FIELD_LABELS[key]||'入力内容'}：${message}`;
        a.addEventListener('click',()=>control.focus());li.append(a);
      }else li.textContent=String(message);
      list.append(li);
    }
    summary.append(list);summary.focus();
  }
}
function renderReview(data) {
  const root=document.querySelector('#review-content');root.replaceChildren();
  const groups=[['開催について',['workshopType','purpose','desiredDates','participants','prefecture','city','venueName','venueType']],['主催者について',['organizerType','organization','name','occupation','businessActivity','website','email','phone','notes']],['確認・同意',Object.keys(CONSENTS)]];
  for(const [heading,keys] of groups){
    const section=document.createElement('section');section.className='review-group';
    const h=document.createElement('h3');h.textContent=heading;const dl=document.createElement('dl');
    for(const key of keys){const dt=document.createElement('dt');dt.textContent=FIELD_LABELS[key];const dd=document.createElement('dd');dd.textContent=CONSENTS[key]?`同意済み：${CONSENTS[key]}`:displayValue(key,data[key])+(key==='participants'?'名（目安）':'');dl.append(dt,dd);}
    section.append(h,dl);root.append(section);
  }
}
form.addEventListener('submit',event=>{
  event.preventDefault();
  const raw=Object.fromEntries(new FormData(form));for(const key of Object.keys(CONSENTS))raw[key]=form.elements[key].checked;
  const result=validateApplication(raw);showErrors(result.errors);if(!result.data)return;
  currentApplication={...result.data,termsVersion:TERMS_VERSION};renderReview(result.data);
  form.hidden=true;review.hidden=false;complete.hidden=true;document.querySelector('#review-title').focus();
  if(DELIVERY.mode==='live')liveReady.then(()=>liveController?.prepare(currentApplication));
});
document.querySelector('#back-to-form').addEventListener('click',()=>{review.hidden=true;form.hidden=false;form.elements.workshopType.focus();});
document.querySelector('#preview-complete').addEventListener('click',()=>{
  if(!currentApplication||DELIVERY.mode!=='preview')return;
  // Deliberately no transport, storage, analytics or live endpoint in this preview.
  review.hidden=true;complete.hidden=false;document.querySelector('#complete-title').focus();
});
document.querySelector('#return-to-review').addEventListener('click',()=>{complete.hidden=true;review.hidden=false;document.querySelector('#review-title').focus();});
