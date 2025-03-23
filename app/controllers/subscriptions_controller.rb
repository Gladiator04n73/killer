class SubscriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    author = User.find(params[:author_id])
    current_user.authors << author unless current_user.authors.include?(author)
    redirect_to authors_path, notice: 'You have successfully subscribed.'
  end

  def destroy
    subscription = current_user.subscriptions.find_by(author_id: params[:id])
    subscription.destroy if subscription
    redirect_to authors_path, notice: 'Subscription has been cancelled.'
  end
end
