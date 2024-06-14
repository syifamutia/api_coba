const { nanoid } = require('nanoid');
const supabase = require('./supabaseClient');

// Handler untuk menambahkan buku baru
const insertBooksHandler = async (request, h) => {
    try {
        const { name, author, year } = request.payload;

        // Validasi payload
        if (!name || !author || !year) {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon lengkapi nama, penulis, dan tahun buku',
            });
            response.code(400);
            return response;
        }

        // Lakukan operasi penyisipan data ke Supabase
        const { data, error } = await supabase.from('books').insert([
            {
                name,
                author,
                year,
            }
        ]);

        // Handle error dari Supabase
        if (error) {
            console.error('Error inserting book:', error.message);
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Terjadi kesalahan internal',
            });
            response.code(500);
            return response;
        }

        // Jika data berhasil disisipkan
        if (data && data.length > 0) {
            const insertedBook = data[0];
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: insertedBook.id,
                },
            });
            response.code(201);
            return response;
        } else {
            console.error('Buku Berhasil di tambahkan');
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
            });
            response.code(200); // Atau bisa juga menggunakan 400 tergantung situasi
            return response;
        }
    } catch (error) {
        console.error('Error handling insertBooksHandler:', error.message);
        const response = h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam menambahkan buku',
        });
        response.code(500);
        return response;
    }
};




// Handler untuk mengambil semua buku
const getAllBooksHandler = async () => {
    const { data, error } = await supabase.from('books').select('*');

    if (error) {
        console.error('Error fetching books:', error.message);
        return {
            status: 'fail',
            message: 'Gagal mengambil data buku',
        };
    }

    return {
        status: 'success',
        data: {
            books: data,
        },
    };
};

// Handler untuk mengambil buku berdasarkan ID
const getBooksByIdHandler = async (request, h) => {
    const { bookId } = request.params;

    const { data, error } = await supabase.from('books').select('*').eq('id', bookId).single();

    if (error) {
        console.error('Error fetching book:', error.message);
        const response = h.response({
            status: 'fail',
            message: 'Gagal mengambil data buku',
        });
        response.code(500);
        return response;
    }

    if (!data) {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    return {
        status: 'success',
        data: {
            book: data,
        },
    };
};

// Handler untuk mengedit buku berdasarkan ID
const editBooksByIdHandler = async (request, h) => {
    const { bookId } = request.params;
    const { name, year, author } = request.payload;

    if (!name || !year || !author) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon lengkapi nama, tahun, dan penulis buku',
        });
        response.code(400);
        return response;
    }

    const { data: existingBook, error: fetchError } = await supabase.from('books').select('*').eq('id', bookId).single();

    if (fetchError) {
        console.error('Error fetching book:', fetchError.message);
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku',
        });
        response.code(500);
        return response;
    }

    if (!existingBook) {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    const { data, error } = await supabase.from('books').update({
        name,
        year,
        author,
    }).eq('id', bookId);

    if (error) {
        console.error('Error updating book:', error.message);
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku',
        });
        response.code(500);
        return response;
    }

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
};

// Handler untuk menghapus buku berdasarkan ID
const deleteBooksByIdHandler = async (request, h) => {
    const { bookId } = request.params;

    const { data: existingBook, error: fetchError } = await supabase.from('books').select('*').eq('id', bookId).single();

    if (fetchError) {
        console.error('Error fetching book:', fetchError.message);
        const response = h.response({
            status: 'fail',
            message: 'Gagal menghapus buku',
        });
        response.code(500);
        return response;
    }

    if (!existingBook) {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        });
        response.code(404);
        return response;
    }

    const { error } = await supabase.from('books').delete().eq('id', bookId);

    if (error) {
        console.error('Error deleting book:', error.message);
        const response = h.response({
            status: 'fail',
            message: 'Gagal menghapus buku',
        });
        response.code(500);
        return response;
    }

    const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
};

module.exports = {
    insertBooksHandler,
    getAllBooksHandler,
    getBooksByIdHandler,
    editBooksByIdHandler,
    deleteBooksByIdHandler,
};
