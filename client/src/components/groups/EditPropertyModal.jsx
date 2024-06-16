import React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "../ui/dialog"
import { Button } from "../ui/button"

export function EditPropertyModal({ children }) {



    return (
        <Dialog>
            <DialogTrigger>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Add/Update something fun about your group!</DialogTitle>
                </DialogHeader>
                <form className="text-left">
                    <div className="mt-[20px]">
                        <p className="font-bold">Label</p>
                        <input
                        type="text"
                        name="name"
                        className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                        placeholder="What is it about?"/>
                    </div>
                    <div className="mt-[20px]">
                        <p className="font-bold">Something interesting!</p>
                        <textarea
                        type="text"
                        name="subejct"
                        className="bg-gray-50 border border-gray-300 text-sm rounded-sm  w-[400px] p-2.5 focus:outline-none"
                        placeholder="Something fun!"/>
                    </div>
                </form>
                <DialogFooter className="">
                    <div>
                        <Button>Save</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}