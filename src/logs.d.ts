// TODO这里面后面要搞一个超大的union type，以保障埋点类型的正确性
export type LogParams =
  | {
      event: 'click'
      action: 'example click'
      params: {
        title: 'example title'
        body: 'example body'
      }
    }
  | {
      event: 'show'
      action: 'example show'
      params: {
        title: 'example title'
        body: 'example body'
      }
    }
