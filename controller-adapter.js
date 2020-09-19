exports.adaptHapi=(request) => {
    return {
    method: request.method,
    path:request.path
}}

exports.adaptExpress=(request) => {
    return {
    method: request.method,
    path:request.path
}}