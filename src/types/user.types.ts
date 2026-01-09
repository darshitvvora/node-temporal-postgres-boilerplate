export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  mobile: string;
  suspend_status: boolean;
  updated_by?: number | null;
  created_by?: number | null;
  deleted_by?: number | null;
  created_on?: Date;
  updated_on?: Date;
  deleted_on?: Date | null;
}

export interface UserCreationAttributes {
  id?: number;
  name: string;
  email: string;
  mobile: string;
  suspend_status?: boolean;
  updated_by?: number | null;
  created_by?: number | null;
  deleted_by?: number | null;
}

export interface UserUpdateAttributes extends Partial<Omit<UserAttributes, 'id' | 'created_on' | 'updated_on' | 'deleted_on'>> {}
