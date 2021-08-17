export const insertProduct = `
insert into product (id, title, description, price, img_url) values (uuid_generate_v4(), $1, $2, $3, $4)
returning *
`
