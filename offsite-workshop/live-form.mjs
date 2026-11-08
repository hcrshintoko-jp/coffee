// Loaded only when delivery-config explicitly enables live submission.
import {createInquirySender} from './submission.mjs';

export function setupLiveForm(config,showValidation,{
  documentRef=document,
  windowRef=window,
  send=createInquirySender({endpoint:config.endpoint}),
  createRequestId=()=>crypto.randomUUID(),
}={}) {
  const button=documentRef.querySelector('#preview-complete');
  const back=documentRef.querySelector('#back-to-form');
  const panel=documentRef.querySelector('#review-panel');
  const complete=documentRef.querySelector('#complete-panel');
  const verification=documentRef.createElement('div');verification.className='verification-block';
  verification.setAttribute('role','group');verification.setAttribute('aria-labelledby','verification-title');
  const heading=documentRef.createElement('h3');heading.id='verification-title';heading.textContent='送信前の確認';
  const widget=documentRef.createElement('div');widget.className='captcha-widget';
  const notice=documentRef.createElement('p');notice.id='submission-status';notice.className='submission-status';notice.tabIndex=-1;
  notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');notice.setAttribute('aria-atomic','true');
  const retry=documentRef.createElement('button');retry.type='button';retry.className='button button-secondary verification-retry';retry.hidden=true;retry.textContent='認証をもう一度読み込む';
  const contact=documentRef.createElement('a');contact.href='../index.html#contact';contact.className='submission-contact';contact.textContent='店舗へのお問い合わせ';contact.hidden=true;
  verification.append(heading,widget,notice,retry,contact);panel.querySelector('.review-actions').before(verification);
  button.setAttribute('aria-describedby',notice.id);button.textContent='申請を送信する';button.disabled=true;
  let data=null,requestId=null,signature=null,token='',widgetId=null,loading=null,locked=false,inFlight=false,outcomeMessage='';
  const allowed=config.mode==='live'&&typeof config.turnstileSiteKey==='string'&&/^[a-zA-Z0-9_-]{10,200}$/.test(config.turnstileSiteKey);
  function clearToken(){token='';button.disabled=true;}
  function verificationFailed(message){
    if(locked||inFlight)return;
    clearToken();notice.textContent=message;retry.hidden=false;
  }
  async function loadWidget(){
    if(locked||inFlight)return;
    if(!allowed){notice.textContent='現在フォームからの受付を準備中です。店舗へお問い合わせください。';contact.hidden=false;return;}
    if(widgetId!==null)return;
    notice.textContent='不正送信を防ぐための認証を読み込んでいます。';retry.hidden=true;
    if(!loading)loading=new Promise((resolve,reject)=>{
      const script=documentRef.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
      const fail=()=>{clearTimeout(timer);script.remove();reject(new Error('verification_unavailable'));};
      const timer=setTimeout(fail,10000);
      script.onload=()=>{clearTimeout(timer);resolve();};script.onerror=fail;documentRef.head.append(script);
    });
    try{
      await loading;
      if(widgetId!==null||locked||inFlight)return;
      widgetId=windowRef.turnstile.render(widget,{sitekey:config.turnstileSiteKey,action:'offsite_inquiry',size:'compact',theme:'light',language:'ja',
        callback:value=>{
          if(locked||inFlight)return;
          if(typeof value!=='string'||!value)return;
          token=value;button.disabled=false;retry.hidden=true;
          notice.textContent=outcomeMessage?`${outcomeMessage} 認証が完了しました。再度送信する場合は送信ボタンを押してください。`:'確認ができました。内容を確認して送信してください。';
        },
        'expired-callback':()=>verificationFailed('認証の有効期限が切れました。申請はまだ送信されていません。もう一度認証してください。'),
        'timeout-callback':()=>verificationFailed('認証に時間がかかっています。申請はまだ送信されていません。もう一度認証してください。'),
        'error-callback':()=>verificationFailed('認証を確認できません。申請はまだ送信されていません。もう一度認証してください。'),
      });
    }catch{
      loading=null;verificationFailed('送信前の認証を読み込めませんでした。申請はまだ送信されていません。');contact.hidden=false;
    }
  }
  retry.addEventListener('click',()=>{
    if(locked||inFlight)return;
    clearToken();retry.hidden=true;
    notice.textContent='送信前の認証をもう一度確認しています。';
    if(widgetId!==null)windowRef.turnstile.reset(widgetId);else loadWidget();
  });
  button.addEventListener('click',async()=>{
    if(locked||inFlight||!data||!token||button.disabled)return;
    inFlight=true;button.disabled=true;back.disabled=true;retry.hidden=true;panel.setAttribute('aria-busy','true');
    notice.textContent='申請を送信しています。画面を閉じずにお待ちください。';
    let result;
    try{result=await send({...data,requestId,turnstileToken:token,websiteTrap:''});}
    catch{result={kind:'unknown'};}
    inFlight=false;panel.setAttribute('aria-busy','false');
    if(result.kind==='success'){
      locked=true;clearToken();panel.hidden=true;complete.hidden=false;complete.replaceChildren();
      const card=documentRef.createElement('div');card.className='completion-card';
      const title=documentRef.createElement('h2');title.id='complete-title';title.tabIndex=-1;title.textContent='申請を受け付けました。';
      const message=documentRef.createElement('p');message.textContent='開催はまだ確定していません。担当者が内容を確認し、ご入力のメールアドレスへご連絡します。';
      const ref=documentRef.createElement('p');ref.className='request-reference';ref.textContent=`受付番号：${requestId}`;
      const confirmation=documentRef.createElement('p');confirmation.textContent='受付内容の自動返信メールはお送りしていません。受付番号をお控えください。';
      const returnLink=documentRef.createElement('a');returnLink.href='../index.html';returnLink.className='button button-secondary';returnLink.textContent='本体サイトへ戻る';
      card.append(title,message,ref,confirmation,returnLink);complete.append(card);title.focus();return;
    }
    if(result.kind!=='invalid'&&result.kind!=='not_sent'){
      locked=true;clearToken();contact.hidden=false;
      notice.textContent=`送信結果を確認できません。重複を避けるため再送せず、受付番号 ${requestId} を控えて店舗へお問い合わせください。`;notice.focus();return;
    }
    back.disabled=false;clearToken();
    outcomeMessage=result.errorMessage||'申請は送信されていません。入力内容と認証を確認してください。';
    notice.textContent=outcomeMessage;contact.hidden=false;
    if(widgetId!==null)windowRef.turnstile.reset(widgetId);
    if(result.kind==='invalid'){
      // Validation happens before delivery. Issue a fresh ID after correction,
      // including corrections to non-field state such as a CAPTCHA token.
      signature=null;showValidation(result.fieldErrors||{form:outcomeMessage});
    }else notice.focus();
  });
  return {prepare(value){
    if(locked||inFlight)return;
    const next=JSON.stringify(value);
    if(signature!==next){data=value;signature=next;requestId=createRequestId();outcomeMessage='';clearToken();if(widgetId!==null)windowRef.turnstile.reset(widgetId);}
    loadWidget();
  }};
}
