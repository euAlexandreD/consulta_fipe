export type Ano = {
    nome: string
    valor: string
}

export type Marca = {
    nome: string,
    valor: string
}

export type Modelo = {
    modelo: string,
    valor: string
}

export type TipoVeiculo = 'carros' | 'motos' | 'caminhoes'

export type Fipe = {
    valor: string,
    marca: string,
    modelo: string,
    anoModelo: number,
    combustivel: string,
    mesReferencia: string,
    siglaCombustivel: string
}

export type Cnpj = {
    uf: string
    cep: string
    pais: string
    nome_socio: string
    codigo_pais: string
    faixa_etaria: string
    cnpj: string
}