export class CreatePedidoDto {
  CodigoPedido!: number;
  NomePaciente!: string;
  DataNascimento!: string;
  Sexo!: string;
  CodUnidade!: number;
  Exames!: {
    CodigoItemPedido: number;
    AccessionNumber: string;
    Modalidade: string;
    NomeProcedimento: string;
  }[];
}