import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from '../../../core/api';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CategoriesActions, selectCategoriesList } from '../../store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { selectUserRole } from 'src/app/core/auth/store';

@Component({
  selector: 'app-categories-tree',
  templateUrl: './categories-tree.component.html',
  styleUrls: ['./categories-tree.component.scss'],
})
export class CategoriesTreeComponent implements OnInit, OnDestroy {
  categories$ = this.store.select(selectCategoriesList);
  role$ = this.store.select(selectUserRole);
  categoriesTree$ = this.categories$.pipe(
    map((categories) => {
      const filtered = categories.filter(cat => cat.name !== 'Trending' && cat.name !== 'Promotions');
      return CategoriesTreeComponent.createTree(filtered);
    }),
  );
  private subscription!: Subscription;

  tree: Category[] = [];
  treeControl = new NestedTreeControl<Category, number>(
    (node) => node.childCategories,
    { trackBy: (node) => node.id },
  );
  dataSource = new MatTreeNestedDataSource<Category>();
  newNode: { name: string; parentCategory: null | Category } = {
    name: '',
    parentCategory: null,
  };

  // formGroup: FormGroup
  formGroup = new FormGroup({
    newName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private store: Store) {}

  static createTree(categories: Category[]): Category[] {
    const hashTable = Object.create(null);
    categories.forEach(
      (category) =>
        (hashTable[category.id] = { ...category, childCategories: [] }),
    );
    const dataTree: Category[] = [];
    categories.forEach((category) => {
      if (category.parentCategory?.id) {
        hashTable[category.parentCategory.id].childCategories.push(
          hashTable[category.id],
        );
      } else {
        dataTree.push(hashTable[category.id]);
      }
    });
    return dataTree;
  }

  ngOnInit() {
    this.subscription = this.categoriesTree$.subscribe((categories) => {
      this.tree = [...categories, this.newNode as Category];
      this.newNode.parentCategory = null;
      this.dataSource.data = this.tree;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  hasChild = (_: number, node: Category) =>
    !!node.childCategories && node.childCategories.length > 0;

  hasNoContent = (_: number, node: Category) => !node.name;

  addCategory(category?: Category) {
    if (this.newNode.parentCategory) {
      this.newNode.parentCategory.childCategories =
        this.newNode.parentCategory.childCategories.filter(
          (c) => c !== this.newNode,
        );
    }
    this.newNode.parentCategory = category ?? null;
    this.tree = this.tree.filter((c) => c !== this.newNode);
    if (category) {
      category.childCategories = [
        ...category.childCategories,
        this.newNode as Category,
      ];
    } else {
      this.tree = [...this.tree, this.newNode as Category];
    }
    this.dataSource.data = [];
    this.dataSource.data = this.tree;
    if (category) {
      this.treeControl.expand(category);
    }
    this.formGroup.reset();
  }

  add() {
    if (this.formGroup.invalid) {
      return;
    }
    this.store.dispatch(
      CategoriesActions.addCategory({
        data: {
          name: this.formGroup.value.newName,
          description: '',
          parentCategoryId: this.newNode.parentCategory?.id,
        },
      }),
    );
    this.formGroup.reset();
  }
}
