import { useEffect, useState } from "react"
import { type Marca, type Modelo, type Ano, type Fipe, type TipoVeiculo } from "../../lib/types";
import { apiFetch } from "../../lib/api";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { ChevronDown } from "lucide-react";

const rotulosTipo: Record<TipoVeiculo, string> = {
    carros: 'Carros',
    motos: 'Motos',
    caminhoes: 'Caminhões',
}

export const Vehicles = () => {

    const [fipe, setFipe] = useState<Fipe | null>(null);
    const [ano, setAno] = useState<Ano[]>([]);
    const [marca, setMarca] = useState<Marca[]>([]);
    const [modelo, setModelo] = useState<Modelo[]>([]);
    const [erro, setErro] = useState<string | null>(null)
    const tiposVeiculos: TipoVeiculo[] = ['carros', 'motos', 'caminhoes']
    const [tipoVeiculoSelecionado, setTipoVeiculoSelecionado] = useState<TipoVeiculo>('carros')

    const [marcaSelecionada, setMarcaSelecionada] = useState('');
    const [modeloSelecionado, setModeloSelecionado] = useState('');
    const [anoSelecionado, setAnoSelecionado] = useState('');


    async function carregarMarcas() {
        const res = await apiFetch(`/api/fipe/marcas/v1/${tipoVeiculoSelecionado}`)
        if (!res.ok) throw new Error(`Erro ${res.status} ao carregar as marcas`);
        const dados: Marca[] = await res.json()
        console.log(dados)
        return dados
    }

    async function carregarModelo(codigoMarca: string) {
        const res = await apiFetch(`/api/fipe/veiculos/v1/${tipoVeiculoSelecionado}/${codigoMarca}`);
        if (!res.ok) throw new Error(`Erro ${res.status} ao carregar modelos`)
        const dados: Modelo[] = await res.json()
        console.log(dados)
        return dados 
    }

    async function carregarAno(codigoMarca: string, codigoModelo: string) {
        const res = await apiFetch(`/api/fipe/anos/v1/${tipoVeiculoSelecionado}/${codigoMarca}/${codigoModelo}`);
        if(!res.ok) throw new Error(`Erro ${res.status} ao carregar os anos`)
        const dados: Ano[] = await res.json()
        console.log(dados)
        return dados
    }

    async function carregarFipe(codigoMarca: string, codigoModelo: string, codigoAno: string) {
        const res = await apiFetch(`/api/fipe/detalhes/v1/${tipoVeiculoSelecionado}/${codigoMarca}/${codigoModelo}/${codigoAno}`);
        if(!res.ok) throw new Error(`Erro ${res.status} ao carregar fipe`)
        const dados: Fipe = await res.json()
        console.log(dados)
        return dados
    }

    useEffect(() => {
        let ativo = true
        setMarcaSelecionada('');
        setModeloSelecionado('');
        setAnoSelecionado('');
        setModelo([]);
        setAno([]);
        setErro(null)
        setFipe(null)

        carregarMarcas()
            .then(dados => {if(ativo) setMarca(dados) })
            .catch(() => {if(ativo) setErro('Não foi possivel carregar os dados')})
            .finally()

        return () => { ativo = false }
    }, [tipoVeiculoSelecionado])

    useEffect(() => {
        if(!marcaSelecionada) return
        let ativo = true;
        setModeloSelecionado('');
        setAnoSelecionado('')
        setAno([]);
        setErro(null)
        setFipe(null)

        carregarModelo(marcaSelecionada)
            .then(dados => { if(ativo) setModelo(dados) })
            .catch(() => { if(ativo) setErro('Não foi possivel carregar os modelos.') })

        return () => { ativo = false }
    }, [marcaSelecionada]); 

     useEffect(() => {
        if(!modeloSelecionado) return
        let ativo = true;
        setAnoSelecionado('')
        setAno([])
        setErro(null)
        setFipe(null)

        carregarAno(marcaSelecionada ,modeloSelecionado)
            .then(dados => { if(ativo) setAno(dados) })
            .catch(() => { if(ativo) setErro('Não foi possivel carregar os anos.') })

        return () => { ativo = false }
    }, [marcaSelecionada, modeloSelecionado]); 

    async function buscarFipe() {
        setErro(null)
        setFipe(null)
        try {
            const dados = await carregarFipe(marcaSelecionada, modeloSelecionado, anoSelecionado);
            setFipe(dados);
        } catch {
            setErro('Não foi possivel carregar a fipe.')
        }
    }

    return (
        <main className="min-h-svh bg-background text-left text-foreground">
          <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-8 md:py-14">

            <header className="flex flex-col gap-1 pb-2">
              <span className="text-sm font-medium text-muted-foreground">Tabela FIPE</span>
              <h1 className="m-0! font-sans! text-2xl! font-semibold! tracking-tight! text-foreground! md:text-3xl!">
                Consulte o valor do veículo
              </h1>
              <span className="text-sm text-muted-foreground">
                Escolha o tipo, a marca, o modelo e o ano.
              </span>
            </header>

            <section className="flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm md:p-6">
              <div role="group" aria-label="Tipo de veículo" className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
                {tiposVeiculos.map(tipo => {
                  const selecionado = tipo === tipoVeiculoSelecionado
                  return (
                    <button
                      key={tipo}
                      type="button"
                      aria-pressed={selecionado}
                      onClick={() => setTipoVeiculoSelecionado(tipo)}
                      className={cn(
                        "h-10 rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        selecionado
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {rotulosTipo[tipo]}
                    </button>
                  )
                })}
              </div>

              <CampoSelect
                id="marca"
                label="Marca"
                placeholder="Selecione a marca"
                value={marcaSelecionada}
                onChange={setMarcaSelecionada}
                disabled={marca.length === 0}
                opcoes={marca.map(m => ({ valor: m.valor, nome: m.nome }))}
              />

              <CampoSelect
                id="modelo"
                label="Modelo"
                placeholder={marcaSelecionada ? "Selecione o modelo" : "Escolha a marca primeiro"}
                value={modeloSelecionado}
                onChange={setModeloSelecionado}
                disabled={modelo.length === 0}
                opcoes={modelo.map(m => ({ valor: m.valor, nome: m.modelo }))}
              />

              <CampoSelect
                id="ano"
                label="Ano"
                placeholder={modeloSelecionado ? "Selecione o ano" : "Escolha o modelo primeiro"}
                value={anoSelecionado}
                onChange={setAnoSelecionado}
                disabled={ano.length === 0}
                opcoes={ano.map(a => ({ valor: a.valor, nome: a.nome }))}
              />

              <Button
                type="button"
                onClick={buscarFipe}
                disabled={!anoSelecionado}
                className="mt-2 h-11 w-full text-base"
              >
                Consultar FIPE
              </Button>
            </section>

            {erro && (
              <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {erro}
              </div>
            )}

            {fipe && (
              <section aria-live="polite" className="flex flex-col gap-4 rounded-xl border bg-card p-4 text-card-foreground shadow-sm md:p-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Valor FIPE</span>
                  <span className="text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">{fipe.valor}</span>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 text-sm">
                  <Detalhe rotulo="Marca" valor={fipe.marca} />
                  <Detalhe rotulo="Ano" valor={String(fipe.anoModelo)} />
                  <Detalhe rotulo="Modelo" valor={fipe.modelo} className="col-span-2" />
                  <Detalhe rotulo="Combustível" valor={fipe.combustivel} />
                  <Detalhe rotulo="Referência" valor={fipe.mesReferencia} />
                </dl>
              </section>
            )}
          </div>
        </main>
    )
}

type Opcao = { valor: string; nome: string }

type CampoSelectProps = {
    id: string
    label: string
    placeholder: string
    value: string
    onChange: (valor: string) => void
    opcoes: Opcao[]
    disabled?: boolean
}

function CampoSelect({ id, label, placeholder, value, onChange, opcoes, disabled }: CampoSelectProps) {
    return (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id} className="text-sm font-medium">{label}</label>
          <div className="relative">
            <select
              id={id}
              value={value}
              onChange={e => onChange(e.target.value)}
              disabled={disabled}
              className="h-11 w-full appearance-none truncate rounded-lg border border-input bg-background pr-10 pl-3 text-base text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{placeholder}</option>
              {opcoes.map(o => (
                <option key={o.valor} value={o.valor}>{o.nome}</option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
    )
}

function Detalhe({ rotulo, valor, className }: { rotulo: string; valor: string; className?: string }) {
    return (
        <div className={cn("flex flex-col gap-0.5", className)}>
          <dt className="text-muted-foreground">{rotulo}</dt>
          <dd className="font-medium">{valor}</dd>
        </div>
    )
}