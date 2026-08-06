#[derive(Debug, thiserror::Error)]
pub enum ShipzyError {
    #[error("HTTP error {status}: {message}")]
    Http { status: u16, message: String },
    #[error("Unauthorized")]
    Auth,
    #[error("Request error: {0}")]
    Reqwest(#[from] reqwest::Error),
    #[error("JSON error: {0}")]
    Json(#[from] serde_json::Error),
}

pub type Result<T> = std::result::Result<T, ShipzyError>;
