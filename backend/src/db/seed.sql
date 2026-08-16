INSERT INTO categories (name)
VALUES
    ('Salary'),
    ('Food'),
    ('Transport'),
    ('Shopping'),
    ('Bills'),
    ('Entertainment'),
    ('Healthcare'),
    ('Education'),
    ('Rent'),
    ('Other')
ON CONFLICT (name) DO NOTHING;