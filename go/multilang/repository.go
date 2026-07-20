package multilang

type TranslationRepository interface {
	Get(key, lang string) (*Translation, error)
	List(lang string) ([]*Translation, error)
	Save(tr *Translation) error
}
