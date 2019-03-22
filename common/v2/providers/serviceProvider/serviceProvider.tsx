import React, { Component, createContext } from 'react';

type Extended<R> = R & { uuid: string };

interface State<R> {
  resource: Extended<R>[];
  create(resource: R): void;
  update(uuid: string, resource: R): void;
  destroy(uuid: string): void;
}

export interface Service<R> {
  init(): void;
  create(resource: R): void;
  read(uuid: string): R;
  update(uuid: string, resource: R): void;
  destroy(uuid: string): void;
  readAll(): Extended<R>[];
}

export function serviceProvider<R>(service: Service<R>) {
  return class ResourceProvider extends Component<{}, State<R>> {
    public static Context = createContext({} as State<R>);

    public readonly state: State<R> = {
      resource: service.readAll() || [],
      create: (resource: R) => {
        service.create(resource);
        this.getResource();
      },
      update: (uuid: string, resource: R) => {
        service.update(uuid, resource);
        this.getResource();
      },
      destroy: (uuid: string) => {
        service.destroy(uuid);
        this.getResource();
      }
    };

    public render() {
      const { children } = this.props;
      return (
        <ResourceProvider.Context.Provider value={this.state}>
          {children}
        </ResourceProvider.Context.Provider>
      );
    }

    private getResource = () => {
      const resource = service.readAll() || [];
      this.setState({ resource });
    };
  };
}