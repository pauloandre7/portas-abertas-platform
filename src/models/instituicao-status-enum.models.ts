// funcinoa como um enum. O "as const" impede alterações
export const Status = {
    ATIVO: "ativo",
    INATIVO: "inativo",
    PENDENTE: "pendente"
} as const;

// Vai exportar como um Tipo
export type StatusInstituicao = typeof Status[keyof typeof Status];