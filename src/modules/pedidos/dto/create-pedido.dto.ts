export class CreatePedidoDto {
  codigoPedido!: number;
  nomePaciente!: string;
  dataNascimento!: string;
  sexo!: string;
  codUnidade!: number;
  exams!: {
    codigoItemPedido: number;
    accessionNumber: string;
    modalidade: string;
    nomeProcedimento: string;
  }[];
}