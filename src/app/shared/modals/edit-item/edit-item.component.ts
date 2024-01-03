import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@shared/components/button/button.component';
import { IData } from '@core/models/IData';
import { deleteItemResourceLS, insertItemResourceLS, updateItemResourceLS } from '@core/services/localstorange/LS.item';

@Component({
  selector: 'edit-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent {
  @Input() show = false;
  @Input() data: IData = {};
  @Input() idResource: string = "";
  @Output() eventShow = new EventEmitter<boolean>(false);
  @Output() eventActionItemResource = new EventEmitter<{ action: string, object: IData }>();
  toggleShow() {
    this.show = !this.show;
    this.eventShow.emit(this.show)
  }


  cancel(event: any) {
    this.toggleShow()
    //TODO: delete data modal
  }

  ngAfterViewInit() {
    const formElement = document.getElementById('editItemResourceForm') as HTMLElement;
    if (formElement) {
      formElement.addEventListener('submit', (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        formData.forEach((value, key) => {
          //TODO if ("answer" == key) { this.data.answer = value.toString() }
          //TODO if ("question" == key) { this.data.question = value.toString() }
          if ("observation" == key) { this.data.observation = value.toString() }
          if ("rangeCopleted" == key) { this.data.rangeCopleted = Number(value.toString()) }
        });

        if (!event.target) return

        if (this.data.id == "" || this.data.id == undefined) {
          insertItemResourceLS(this.data, this.idResource).then(res => {
            if (!res) return
            this.toggleShow()
            this.eventActionItemResource.emit({ action: "insertItemResource", object: this.data })
          })
        } else {
          updateItemResourceLS(this.data, this.idResource).then(res => {
            if (!res) return
            this.toggleShow()
            this.eventActionItemResource.emit({ action: "updateItemResource", object: this.data })
          })
        }

      });
    }
  }

  handleDeleteItemResource(event: any) {
    if (!this.data.id) return
    deleteItemResourceLS(this.data.id, this.idResource).then(res => {
      if (!res) throw new Error("Error delete item");
      this.eventActionItemResource.emit({ action: "deleteItemResource", object: this.data })
      alert("Delete list")
      this.toggleShow()
    })
  }
}