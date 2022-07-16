export interface globalResponse<T> {
  code: number;
  data: T;
  msg: string;
}

/**
 * 资金变动
 */
export interface 资金变动 {
  billing_id: number;
  category: string;
  create_time: string;
  /**
   * 正为收入
   */
  price: number;
  user_id: number;
}
