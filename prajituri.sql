DROP TYPE IF EXISTS categ_produs;
DROP TYPE IF EXISTS tipuri_produse;
DROP TABLE IF EXISTS produse;

CREATE TYPE categ_produs AS ENUM('comanda speciala', 'evenimente', 'promotional', 'personalizat', 'standard');
CREATE TYPE tipuri_produse AS ENUM('reviste', 'bannere', 'roll-up-uri', 'cataloage', 'alte servicii');

CREATE TABLE IF NOT EXISTS produse (
    id SERIAL PRIMARY KEY,
    nume VARCHAR(100) UNIQUE NOT NULL,
    descriere TEXT,
    pret NUMERIC(8,2) NOT NULL CHECK (pret >= 0),
    gramaj INT NOT NULL CHECK (gramaj >= 0),
    dimensiune VARCHAR(50),
    tip_produs tipuri_produse DEFAULT 'reviste',
    categorie categ_produs DEFAULT 'standard',
    materiale VARCHAR[],
    imagine VARCHAR(300),
    customizabil BOOLEAN NOT NULL DEFAULT TRUE,
    data_adaugare TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO produse (nume, descriere, pret, gramaj, dimensiune, tip_produs, categorie, materiale, imagine, customizabil) VALUES

('Revista Awards Premium', 'Revistă de lux pentru gale și evenimente de premiere', 45.50, 150, 'A4 (21x29.7cm)', 'reviste', 'evenimente', ARRAY['hartie_creta', 'laminare_UV', 'print_offset'], 'awards.png', true),
('Revista Constructiv', 'Revistă de specialitate în construcții și arhitectură', 52.30, 120, 'A4 (21x29.7cm)', 'reviste', 'standard', ARRAY['hartie_creta', 'print_offset'], 'constructiv.png', true),
('Market Watch Financial', 'Revistă de analiză financiară și piețe de capital', 62.50, 130, 'A4 (21x29.7cm)', 'reviste', 'standard', ARRAY['hartie_creta', 'print_offset'], 'market_watch.png', true),
('New Money Investment', 'Revistă despre investiții și finanțe personale', 58.90, 140, 'A4 (21x29.7cm)', 'reviste', 'standard', ARRAY['hartie_creta', 'laminare_UV', 'print_offset'], 'new_money.png', true),
('Catalog A. Coman', 'Catalog de produse pentru compania A. Coman', 32.80, 250, 'A4 (21x29.7cm)', 'cataloage', 'personalizat', ARRAY['hartie_offset', 'print_digital'], 'a_coman.png', true),
('Catalog Dialog Services', 'Catalog de produse și servicii Dialog', 41.20, 250, 'A4 (21x29.7cm)', 'cataloage', 'personalizat', ARRAY['hartie_offset', 'print_digital'], 'dialog.png', true),
('Catalog Frâne Auto', 'Catalog de componente auto - sisteme de frânare', 55.40, 300, 'A4 (21x29.7cm)', 'cataloage', 'comanda speciala', ARRAY['hartie_creta', 'laminare_UV', 'print_offset'], 'frane.png', false),
('Catalog Protecții Industriale', 'Catalog pentru echipamente de protecție industrială', 43.60, 280, 'A4 (21x29.7cm)', 'cataloage', 'comanda speciala', ARRAY['hartie_offset', 'print_offset'], 'protectii_industriale.png', false),
('Catalog T&T Services', 'Catalog de servicii pentru compania T&T', 39.50, 260, 'A4 (21x29.7cm)', 'cataloage', 'personalizat', ARRAY['hartie_creta', 'laminare', 'print_offset'], 't&t.png', true),
('Banner Casa Pariurilor', 'Banner promoțional pentru casa de pariuri sportive', 125.00, 510, '300x150cm', 'bannere', 'promotional', ARRAY['PVC_premium', 'cerneala_UV', 'ojeti_metalice'], 'casa_pariurilor.png', false),
('Banner Sisteme Irigații', 'Banner pentru sisteme de irigare agricole', 98.70, 450, '250x120cm', 'bannere', 'promotional', ARRAY['PVC_reciclabil', 'cerneala_eco', 'ojeti_inox'], 'irigatii.png', true),
('Banner HerWatch', 'Banner promoțional pentru ceasuri de damă', 89.90, 480, '200x100cm', 'bannere', 'promotional', ARRAY['PVC_premium', 'cerneala_UV'], 'herwatch.png', true),
('Roll-up Ceder', 'Roll-up portabil pentru servicii Ceder', 185.50, 300, '85x200cm', 'roll-up-uri', 'evenimente', ARRAY['material_textil', 'print_sublimatie', 'structura_aluminiu'], 'ceder.png', true),
('Roll-up CIJ', 'Roll-up pentru Centrul de Investigații Jurnalistice', 175.70, 280, '85x200cm', 'roll-up-uri', 'evenimente', ARRAY['material_textil', 'print_digital', 'structura_aluminiu'], 'cij.png', true),
('Roll-up Fermieri', 'Roll-up pentru asociația fermierilor', 165.60, 250, '85x200cm', 'roll-up-uri', 'evenimente', ARRAY['material_eco', 'cerneala_eco', 'structura_aluminiu'], 'fermieri.png', true),
('Calendar Personalizat', 'Calendar de perete cu design customizabil', 28.90, 200, '30x40cm', 'alte servicii', 'personalizat', ARRAY['hartie_photo', 'print_digital'], 'calendar.png', true),
('Manual Tehnic', 'Manual de instrucțiuni și specificații tehnice', 47.80, 180, 'A5 (14.8x21cm)', 'alte servicii', 'comanda speciala', ARRAY['hartie_offset', 'print_digital'], 'manual.png', false),
('Poster Messi Colecție', 'Poster de colecție cu Lionel Messi', 25.30, 200, 'A2 (42x59.4cm)', 'alte servicii', 'personalizat', ARRAY['hartie_photo', 'print_inkjet'], 'messi.png', true),
('Design Random Creative', 'Material grafic cu design creativ și modern', 35.40, 160, 'A3 (29.7x42cm)', 'alte servicii', 'personalizat', ARRAY['hartie_design', 'print_digital'], 'random.png', true),
('Poster Succes Motivațional', 'Poster motivațional pentru birouri și spații de lucru', 31.80, 220, 'A3 (29.7x42cm)', 'alte servicii', 'standard', ARRAY['hartie_photo', 'print_digital'], 'succes.png', true);