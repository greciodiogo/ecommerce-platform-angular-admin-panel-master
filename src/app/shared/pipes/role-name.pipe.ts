import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleName',
})
export class RoleNamePipe implements PipeTransform {
  roleNames: Record<string, string> = {
    customer: 'Customer',
    sales: 'Salesman',
    manager: 'Manager',
    seller: 'Seller',
    admin: 'Administrator',
    disabled: 'Disabled account',
  };

  transform(value: string): string {
    return this.roleNames[value] ?? value;
  }
}
