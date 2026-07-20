package shared

type Money struct {
	Amount   float64
	Currency string
}

type Address struct {
	FullName    string
	Street      string
	City        string
	Province    string
	CountryCode string
	PostalCode  string
	Phone       string
}
