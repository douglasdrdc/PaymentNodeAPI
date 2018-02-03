function PagamentoDAO(connection){
    this._connection = connection;
}

PagamentoDAO.prototype.getAll = function(callback) {
    this._connection.query('select * from Pagamento', callback);
}

PagamentoDAO.prototype.getById = function(pagamento, callback) {
    this._connection.query('select * from Pagamento where id = ?', [pagamento.id], callback);
}

PagamentoDAO.prototype.insert = function(pagamento, callback) {
    this._connection.query('insert into pagamento set ?', pagamento, callback);
}

PagamentoDAO.prototype.update = function(pagamento, callback) {
    this._connection.query('update pagamento set status = ? where id = ?', [pagamento.status, pagamento.id], callback);
}

PagamentoDAO.prototype.delete = function(pagamento, callback) {
    this._connection.query('update pagamento set status = ? where id = ?', [pagamento.status, pagamento.id], callback);
}

module.exports = function() {
    return PagamentoDAO;
}