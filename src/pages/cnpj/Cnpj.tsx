import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { Cnpj } from "@/lib/types";
import { Fragment, useEffect, useState, type FormEvent } from "react"

export const VerificaCnpj = () => {

    const [cnpj, setCnpj] = useState<string>("");
    const [retornoCnpj, setRetornoCnpj] = useState<Cnpj | null>(null)
    const [erro, setErro] = useState<string | null>(null)

    async function consultarCnpj (e: FormEvent<HTMLFormElement>){
         e.preventDefault()
         setRetornoCnpj(null)

        const res = await apiFetch(`/api/cnpj/v1/${cnpj.replace(/\D/g, '')}`)
        const dados: Cnpj = await res.json()
        console.log(dados)

        if(!res.ok) {
            setErro(dados.message ?? 'Não foi possivel buscar o cnpj')
            return
        }
        setErro(null)
        setRetornoCnpj(dados)  
    }

    return (
        <>
          <div>
            <form onSubmit={consultarCnpj}>
                <input onChange={(e) => setCnpj(e.target.value)} type="text" placeholder="Digite o cnpj"/>
                <Button type="submit">Consutar</Button>
            </form>
          </div>
          <div>
            {erro && <p>{erro}</p>}
            {retornoCnpj ?
                <div key={retornoCnpj.cnpj}>
                    <h1>{retornoCnpj.cnpj}</h1>
                    <p>{retornoCnpj.cep}</p>
                    <p>{retornoCnpj.codigo_pais}</p>
                    <p>{retornoCnpj.faixa_etaria}</p>
                    <p>{retornoCnpj.nome_socio}</p>
                    <p>{retornoCnpj.pais}</p>
                    <p>{retornoCnpj.uf}</p>
                </div>
             : 'Sem dados'}
          </div>
        </>
    )
}