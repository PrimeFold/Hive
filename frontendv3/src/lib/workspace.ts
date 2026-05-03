import { api } from "./axios";

export const getWorkspaces = async () => {
  const { data } = await api.get('/workspaces');
  return data;
};

export const createWorkspace = async (name: string) => {
  const { data } = await api.post('/workspace', { name });
  return data;
};

export const updateWorkspace = async(id:string,newName:string)=>{
    const {data} = await api.post(`/workspace/${id}`,{newName})
    return data;
}

export const getWorkspaceById = async(id:string)=>{
    const {data} = await api.get(`/workspace/${id}`)
    return data;
}

