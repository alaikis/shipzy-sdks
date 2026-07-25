package zymeup

// ZymeupClient is the main entry point for the Zymeup Go SDK
type ZymeupClient struct {
	Epod *EpodClient
}

// NewZymeupClient creates a new ZymeupClient with the given API key
func NewZymeupClient(apiKey string) *ZymeupClient {
	c := NewClient(apiKey)
	return &ZymeupClient{
		Epod: &EpodClient{client: c},
	}
}
