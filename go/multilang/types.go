package multilang

type Language struct {
	Code string
	Name string
}

type Translation struct {
	Key     string
	Language string
	Value   string
	Plural  *PluralRule
	Context string
}

type PluralRule struct {
	One   string
	Other string
}

type Locale struct {
	Language   string
	Region     string
	Currency   string
	DateFormat string
	TimeFormat string
}
