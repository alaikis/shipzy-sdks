use reqwest::Method;

use crate::error::Result;
use crate::http_client::HttpClient;
use crate::types::{PaginatedResponse, SupportTicket, TicketMessage};

pub struct SupportTicketClient {
    pub(crate) inner: HttpClient,
}

impl SupportTicketClient {
    pub fn new(inner: HttpClient) -> Self {
        Self { inner }
    }
}

impl SupportTicketClient {
    pub async fn list(
        &self,
        page: i32,
        page_size: i32,
        status: Option<&str>,
    ) -> Result<PaginatedResponse<SupportTicket>> {
        let mut q = format!("?page={}&page_size={}", page, page_size);
        if let Some(s) = status {
            q.push_str(&format!("&status={}", urlencoding::encode(s)));
        }
        self.inner
            .request(
                &format!("/api/v1/support/tickets{}", q),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn get(&self, id: &str) -> Result<SupportTicket> {
        self.inner
            .request(
                &format!("/api/v1/support/tickets/{}", id),
                Method::GET,
                None,
            )
            .await
    }

    pub async fn create(
        &self,
        body: serde_json::Value,
    ) -> Result<SupportTicket> {
        self.inner
            .request(
                "/api/v1/support/tickets",
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn update(
        &self,
        id: &str,
        body: serde_json::Value,
    ) -> Result<SupportTicket> {
        self.inner
            .request(
                &format!("/api/v1/support/tickets/{}", id),
                Method::PUT,
                Some(body),
            )
            .await
    }

    pub async fn add_message(
        &self,
        ticket_id: &str,
        body: serde_json::Value,
    ) -> Result<TicketMessage> {
        self.inner
            .request(
                &format!("/api/v1/support/tickets/{}/messages", ticket_id),
                Method::POST,
                Some(body),
            )
            .await
    }

    pub async fn get_messages(
        &self,
        ticket_id: &str,
        page: i32,
        page_size: i32,
    ) -> Result<PaginatedResponse<TicketMessage>> {
        self.inner
            .request(
                &format!(
                    "/api/v1/support/tickets/{}/messages?page={}&page_size={}",
                    ticket_id, page, page_size
                ),
                Method::GET,
                None,
            )
            .await
    }
}
