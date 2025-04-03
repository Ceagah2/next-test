import { EnumPriority, EnumStatus } from "@/store/types";


export const getStatusLabel = (status: EnumStatus) => {
  switch (status) {
    case EnumStatus.TO_DO:
      return "A Fazer";
    case EnumStatus.IN_PROGRESS:
      return "Em Progresso";
    case EnumStatus.DONE:
      return "Concluída";
    default:
      return "Desconhecido";
  }
};

export const getPriorityLabel = (priority: EnumPriority) => {
  switch (priority) {
    case EnumPriority.HIGH:
      return "Alta";
    case EnumPriority.MEDIUM:
      return "Média";
    case EnumPriority.LOW:
      return "Baixa";
    default:
      return "Desconhecida";
  }
};

export const getStatusColor = (status: EnumStatus) => {
  switch (status) {
    case EnumStatus.TO_DO:
      return "bg-gray-100 text-gray-800";
    case EnumStatus.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800";
    case EnumStatus.DONE:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority: EnumPriority) => {
  switch (priority) {
    case EnumPriority.HIGH:
      return "bg-red-100 text-red-800";
    case EnumPriority.MEDIUM:
      return "bg-blue-100 text-blue-800";
    case EnumPriority.LOW:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
