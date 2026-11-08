// Shared contract for the public form and the separately disabled email API.
export const TERMS_VERSION = 'offsite-2026-11-08-v1';
export const CONSENTS = Object.freeze({
  antiSocial: '申請者、主催団体、共同主催者およびその役員・運営責任者は、暴力団等の反社会的勢力に該当せず、資金提供・便宜供与等の関係がないことを表明し、今後も関係を持たないことを誓約します。',
  nonMlm: '申請者、主催団体および共同主催者は、ネットワークビジネス（MLM・連鎖販売取引）の運営・販売・勧誘活動を行っておらず、本企画もこれらの活動に関連しないことを表明します。',
  noSolicitation: '開催中（受付・休憩・終了時の案内を含む）は、他の事業・商品・サービスの営業、販売、入会・契約の勧誘、勧誘目的の連絡先収集や外部グループへの誘導を行いません。主催者としてスタッフ・参加者にも事前に周知し、勧誘を把握した場合は中止を求めます。',
  honestApplication: '入力内容が事実であることを確認し、必要に応じた主催者・開催内容の確認に協力します。虚偽の申告や上記の違反が判明した場合、受付のお断りや開催中止となることを了承します。申請のみでは開催は確定せず、日程・費用・開催条件は別途相談のうえ決定します。',
  privacy: '下記「申請情報の取り扱い」を確認し、申請内容の確認、開催可否・見積もりの検討、日程調整および連絡のために入力情報を利用することに同意します。',
});
export const FIELD_LABELS = Object.freeze({
  workshopType:'希望するワークショップ',purpose:'開催の目的・参加される方',desiredDates:'希望日・時期',participants:'参加人数の目安',prefecture:'開催する都道府県',city:'市区町村・地域',venueName:'会場名・施設名',venueType:'会場の環境',organizerType:'主催者の区分',organization:'会社・団体名',name:'ご担当者のお名前',occupation:'職業・お仕事内容',businessActivity:'主催者の事業・活動内容',website:'公式サイト・活動紹介URL',email:'メールアドレス',phone:'電話番号',notes:'ご相談・補足',antiSocial:'反社会的勢力との関係がないこと',nonMlm:'ネットワークビジネスに該当しないこと',noSolicitation:'他のビジネスへの勧誘を行わないこと',honestApplication:'申請内容と開催までの流れ',privacy:'申請情報の取り扱い',
});
export const OPTIONS = Object.freeze({
  workshopType:{roast:'珈琲焙煎',drip:'ハンドドリップ',consult:'相談して決めたい'},
  organizerType:{individual:'個人',company:'法人・店舗',group:'団体・学校・その他'},
  venueType:{indoor:'屋内',outdoor:'屋外',undecided:'未定・相談したい'},
});
export const PREFECTURES = '北海道 青森県 岩手県 宮城県 秋田県 山形県 福島県 茨城県 栃木県 群馬県 埼玉県 千葉県 東京都 神奈川県 新潟県 富山県 石川県 福井県 山梨県 長野県 岐阜県 静岡県 愛知県 三重県 滋賀県 京都府 大阪府 兵庫県 奈良県 和歌山県 鳥取県 島根県 岡山県 広島県 山口県 徳島県 香川県 愛媛県 高知県 福岡県 佐賀県 長崎県 熊本県 大分県 宮崎県 鹿児島県 沖縄県 海外'.split(' ');
const TEXT_LIMITS = {purpose:1000,desiredDates:300,city:100,venueName:200,organization:120,name:80,occupation:160,businessActivity:500,website:500,email:254,phone:40,notes:2000};
const REQUIRED = ['purpose','desiredDates','city','name','occupation','businessActivity','email'];
export function validateApplication(input) {
  const errors = {}, data = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {data:null, errors:{form:'入力形式を確認してください。'}};
  for (const [key,max] of Object.entries(TEXT_LIMITS)) {
    if (input[key] != null && typeof input[key] !== 'string') { errors[key]='文字で入力してください。'; continue; }
    data[key]=(input[key]||'').trim().replace(/\r\n?/g,'\n');
    if (data[key].length>max) errors[key]=`${max}文字以内で入力してください。`;
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(data[key])) errors[key]='使用できない制御文字が含まれています。';
  }
  for (const key of REQUIRED) if (!data[key]) errors[key]=`${FIELD_LABELS[key]}を入力してください。`;
  for (const [key,options] of Object.entries(OPTIONS)) {
    if (typeof input[key]!=='string'||!Object.hasOwn(options,input[key])) errors[key]=`${FIELD_LABELS[key]}を選択してください。`;
    else data[key]=input[key];
  }
  if (input.organizerType!=='individual' && !data.organization) errors.organization='会社・団体名を入力してください。';
  if (!PREFECTURES.includes(input.prefecture)) errors.prefecture='開催する都道府県を選択してください。'; else data.prefecture=input.prefecture;
  const count=typeof input.participants==='number'?String(input.participants):input.participants;
  if (typeof count!=='string'||!/^\d{1,4}$/.test(count)||Number(count)<1) errors.participants='人数の目安を1〜9999の整数で入力してください。'; else data.participants=Number(count);
  if (data.email && (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email) || /[,;:"\\\[\]]/.test(data.email))) errors.email='メールアドレスの形式を確認してください。';
  if (data.phone && !/^[0-9+()\-\s]{6,40}$/.test(data.phone)) errors.phone='電話番号を半角数字・ハイフンで入力してください。';
  if (data.website) {
    try {const url=new URL(data.website);if(!['http:','https:'].includes(url.protocol)||url.username||url.password) throw new Error();}
    catch {errors.website='https:// または http:// で始まるURLを入力してください。';}
  }
  for (const key of Object.keys(CONSENTS)) {
    data[key]=input[key]===true;
    if(!data[key]) errors[key]='内容をご確認のうえ、チェックしてください。';
  }
  return {data:Object.keys(errors).length?null:data,errors};
}

export function displayValue(key,value) { return OPTIONS[key]?.[value] || (typeof value==='boolean'?(value?'同意済み':'未同意'):(value===''?'記載なし':String(value))); }
