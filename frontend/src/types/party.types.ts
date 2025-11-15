// src/types/party.types.ts

export type Topic = 
  | 'Salud' 
  | 'Economía' 
  | 'Educación' 
  | 'Seguridad' 
  | 'Política' 
  | 'Interior' 
  | 'Otros';

export type Gender = 'Masculino' | 'Femenino' | 'Otro';

export interface Candidate {
  id: string;
  categoryId: string; // ID de la categoría de la elección
  categoryName: string; // Nombre de la categoría (ej: "Presidente", "Senador")
  firstName: string;
  lastName: string;
  imageUrl: string;
  proposalDescription: string;
  topic: Topic;
  gender: Gender;
}

export interface Party {
  id: string;
  electionId: string; // Relación con la elección
  electionName: string; // Nombre de la elección para referencia
  name: string; // Nombre del partido
  representative: string; // Representante del partido
  logoUrl: string; // URL del logo del partido
  candidates: Candidate[]; // Array de candidatos (uno por categoría mínimo)
  createdAt: string;
}

export interface PartyFormData {
  name: string;
  representative: string;
  logoUrl: string;
  candidates: Candidate[];
}

export interface CSVRow {
  partido: string;
  representante: string;
  url: string;
  categoria: string;
  nombres: string;
  apellidos: string;
  urlCandidato: string;
  descripcion: string;
  tema: Topic;
  sexo: Gender;
}

export interface CSVImportData {
  fileName: string;
  rows: CSVRow[];
  eliminateDuplicates: boolean;
  eliminateNulls: boolean;
}


//---
//
//## **✅ EXPLICACIÓN DE LOS TYPES:**
//
//### **1. `Topic` (Temas de propuestas)**
//Los 7 temas disponibles para las propuestas de los candidatos.
//
//### **2. `Gender` (Sexo del candidato)**
//Opciones de género del candidato.
//
//### **3. `Candidate` (Candidato)**
//Representa un candidato dentro de un partido para una categoría específica:
//- `categoryId`: ID de la categoría (ej: "presidente-123")
//- `categoryName`: Nombre legible (ej: "Presidente")
//- Datos personales + propuesta + tema
//
//### **4. `Party` (Partido)**
//Representa un partido político asociado a una elección:
//- `electionId`: Para relacionarlo con la elección
//- `electionName`: Para mostrar en las vistas
//- Datos del partido + array de candidatos
//
//### **5. `PartyFormData`**
//Estructura de datos del formulario al crear/editar partido.
//
//### **6. `CSVRow`**
//Estructura de cada fila del CSV importado.
//
//### **7. `CSVImportData`**
//Datos del modal de importación CSV con configuraciones.
//
//---
//
//## **🔄 RELACIÓN CON ELECCIONES:**
//
//Un partido se relaciona así:
//```
//ELECCIÓN (election.types.ts)
//  └─ categories: Category[]
//       └─ { id, name }
//
//PARTIDO (party.types.ts)
//  └─ candidates: Candidate[]
//       └─ { categoryId, categoryName, ... }