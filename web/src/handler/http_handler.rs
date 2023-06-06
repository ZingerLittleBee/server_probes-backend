use actix_web::{HttpResponse, Responder, post, web, HttpRequest};
use actix_web::body::BoxBody;
use actix_web::http::header::ContentType;
use sysinfo::{Pid, ProcessExt, System, SystemExt};
use serde::{Deserialize, Serialize};
use sled::Db;
use crate::token::communication_token::CommunicationToken;

#[derive(Deserialize, Serialize, Default, Debug)]
pub struct HttpResult {
    success: bool,

    #[serde(skip_serializing_if = "Option::is_none")]
    message: Option<String>,
}

impl HttpResult {
    fn new(success: bool) -> HttpResult {
        HttpResult {
            success,
            message: None,
        }
    }

    fn new_msg(success: bool, message: String) -> HttpResult {
        HttpResult {
            success,
            message: Some(message),
        }
    }
}

impl Responder for HttpResult {
    type Body = BoxBody;

    fn respond_to(self, _req: &HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();

        // Create response and set content type
        HttpResponse::Ok()
            .content_type(ContentType::json())
            .body(body)
    }
}

#[derive(Deserialize, Serialize, Default, Debug)]
pub struct KilledInfo {
    pid: String
}

/// To check service state
pub async fn index() -> impl Responder {
    HttpResponse::Ok()
}

pub async fn version() -> impl Responder {
    env!("CARGO_PKG_VERSION")
}

#[post("/kill")]
pub async fn kill_process(_token: CommunicationToken, info: web::Json<KilledInfo>) -> impl Responder {
    let pid: Pid = info.pid.parse().unwrap();
    let mut sys = System::new();
    let refresh_res = sys.refresh_process(pid);
    if refresh_res {
        if let Some(process) = sys.process(pid) {
            return HttpResult::new(process.kill());
        }
        HttpResult::new(false)
    } else {
        HttpResult::new_msg(false, "进程不存在".into())
    }
}

#[derive(Deserialize, Serialize, Default, Debug)]
pub struct TokenInfo {
    token: String
}

#[post("/token/rest")]
pub async fn rest_token(_token: CommunicationToken, db: web::Data<Db>, info: web::Json<TokenInfo>) -> impl Responder {
    db.insert(CommunicationToken::token_key(), info.token.as_bytes()).unwrap();
    HttpResult::new(true)
}

/// private api localhost only
// /token/view
pub async fn view_token(db: web::Data<Db>) -> impl Responder {
    if let Some(value) = db.get(CommunicationToken::token_key()).unwrap() {
        std::str::from_utf8(&value).unwrap_or_default().to_owned()
    } else {
        "".into()
    }
}

// /token/clear
pub async fn clear_token(db: web::Data<Db>) -> impl Responder {
    db.remove(CommunicationToken::token_key()).unwrap();
    HttpResult::new(true)
}